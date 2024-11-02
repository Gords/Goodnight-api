const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  dialect: "postgres"
};

module.exports = {
  development: {
    ...baseConfig,
    database: process.env.DB_NAME ?? "goodnight_dev",
    host: process.env.DB_HOST ?? "localhost"
  },
  test: {
    ...baseConfig,
    database: "goodnight_test",
    host: "localhost"
  },
  production: {
    ...baseConfig,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};