const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const userModel = require('../models/User');
const config = require('../config');

/**
 * JWT Strategy
 */
const jwtStrategyOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};
const jwtVerify = async (payload, done) => {
  let user;

  try {
    const { email } = payload;

    user = await userModel.findOne({ email });

    if (!user) {
      return done(null, false, { message: '올바르지 않은 인증정보 입니다.' });
    }
  } catch (e) {
    console.error(e);
    return done(e);
  }

  return done(null, user);
};

module.exports = () => {
  passport.use('jwt', new JwtStrategy(jwtStrategyOption, jwtVerify));
};
