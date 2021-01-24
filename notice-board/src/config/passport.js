const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const userModel = require('../models/User');

/**
 * JWT Strategy
 */
const jwtStrategyOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'Test123', // FIXME
};
const jwtVerify = async (payload, done) => {
  let user;

  try {
    const { email, password } = payload;

    user = await userModel.findOne({ where: { email, password } });

    if (!user) {
      return done(null, false, { message: '이메일 또는 비밀번호가 틀렸습니다. 확인 후 다시 시도해주세요.' });
    }
  } catch (e) {
    return done(e);
  }

  return done(null, user);
};

module.exports = () => {
  passport.use(new JwtStrategy(jwtStrategyOption, jwtVerify));
};
