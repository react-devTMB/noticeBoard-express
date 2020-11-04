import passport from 'passport';
import passportLocal from 'passport-local';
import UserService from '../services/user.js';

const LocalStrategy = passportLocal.Strategy;
const userService = new UserService();

// serialize & deserialize User
passport.serializeUser((user, done) => {
  done(null, user.email);
});
passport.deserializeUser(async (email, done) => {
  const user = await userService.findUser(email);
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
});

// local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      userService
        .findUser(email)
        .select({ email: 1, password: 1 })
        .exec((err, user) => {
          if (err) return done(err);
          if (!user) {
            return done(null, false, { message: '존재하지 않는 아이디입니다.' });
          }
          if (!user.comparePassword(password)) return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });

          return done(null, user);
        });
    }
  )
);

export default passport;
