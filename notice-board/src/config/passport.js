const passport = require('passport');
const passportJwt = require('passport-jwt');
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const config = require('./index');
const UserModel = require('../models/User');

module.exports = () => {
  // serialize & deserialize User
  // serialize - 로그인 성공 시, 한번만 호출. 세션에 user 정보 저장(req.session.passport.user)
  passport.serializeUser((user, done) => {
    //user 정보 세션에 저장
    done(null, user);
  });

  // deserializeUser - 클라이언트 측에서 다른 요청이 있을 때, 세션에 담긴 유저 정보를 다시 알려주는 역할
  // 정상적으로 deserializeUser 작동 시, req.isAuthenticated() true 반환. req.user 객체 생성
  passport.deserializeUser(async (user, done) => {
    if (await UserModel.findById({ _id: user._id })) {
      done(null, user);
    } else {
      done(null, false);
    }
  });

  /**
   * Local Strategy
   */
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (email, password, done) => {
        return UserModal.findOne({ where: { email, password } })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: 'Incorrect email or password' });
            }
            return done(null, user, { message: 'Login Successfully' });
          })
          .catch((err) => done(err));
      }
    )
  );

  /**
   * JWT Strategy
   */
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'jwt-secret-123',
      },
      (payload, done) => {
        return UserModel.findOneById(payload.id)
          .then((user) => {
            return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );
};
