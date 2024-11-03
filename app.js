const express = require("express");
const passport = require("passport");
const cors = require("cors");
const helmet = require("helmet");
const connectDatabase = require("./config/database");
const routes = require("./routes");
const { apiLimiter } = require("./middlewares/rateLimiter");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("node:fs");
const path = require("node:path");

// Initialize passport config
require("./config/passport")(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// Read OpenAPI file
const openApiPath = path.join(__dirname, "docs", "openapi.yaml");
const openApiFile = fs.readFileSync(openApiPath, "utf8");
const swaggerDocs = YAML.parse(openApiFile);

// secure headers
app.use(helmet());

// cross origin resource sharing
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

// Serve OpenAPI documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// Base route
app.get("/", (req, res) => {
	res.json({ message: "Welcome to Goodnight API" });
});

// API routes
app.use("/api", routes);

// Error handlers
app.use((req, res) => {
	res.status(404).json({
		status: "error",
		message: "Not Found",
	});
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		status: "error",
		message: "Internal Server Error",
	});
});

// Start server
connectDatabase(app, PORT);

module.exports = app;
