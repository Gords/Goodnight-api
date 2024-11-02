const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const db = require("../models");

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
	passport.use(
		new JwtStrategy(options, async (jwtPayload, done) => {
			try {
				const user = await db.User.findByPk(jwtPayload.id);
				return user ? done(null, user) : done(null, false);
			} catch (error) {
				return done(error, false);
			}
		}),
	);
};
