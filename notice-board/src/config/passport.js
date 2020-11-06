import passport from 'passport';
import passportLocal from 'passport-local';
import passportFacebook from 'passport-facebook';
import passportKakao from 'passport-kakao';
import passportGithub from 'passport-github';
import { findUser, findUserById } from '../services/user.js';
import { findOauthUser, createOauthUser } from '../services/oauth.js';
import { createToken } from '../services/token.js';
import dotenv from 'dotenv';

dotenv.config();

const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
const KakaoStrategy = passportKakao.Strategy;
const GithubStrategy = passportGithub.Strategy;

// serialize & deserialize User
// serialize - 로그인 성공 시, 한번만 호출. 세션에 user 정보 저장(req.session.passport.user)
passport.serializeUser((user, done) => {
  //user 정보 세션에 저장
  done(null, user);
});

// deserializeUser - 클라이언트 측에서 다른 요청이 있을 때, 세션에 담긴 유저 정보를 다시 알려주는 역할
// 정상적으로 deserializeUser 작동 시, req.isAuthenticated() true 반환. req.user 객체 생성
passport.deserializeUser(async (user, done) => {
  if (await findUserById(user._id)) {
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
      findUser(email)
        .select({ password: 1 })
        .exec((err, user) => {
          if (err) return done(err);
          if (!user) return done(null, false, { message: 'Incorrect email.' });
          if (!user.comparePassword(password)) return done(null, false, { message: 'Incorrect password.' });

          return done(null, user);
        });
    }
  )
);

// facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: '/oauth/facebook/callback',
      enableProof: true,
      profileFields: ['id', 'displayName', 'email', 'name'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await findOauthUser(profile.id, profile.provider);

      if (!user) {
        const newUser = await createOauthUser({ ...profile._json, provider: profile.provider });
        await createToken({
          id: profile.id,
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        return done(null, newUser);
      } else {
        return done(null, user);
      }
    }
  )
);

// kakao strategy
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      clientSecret: process.env.KAKAO_SECRET,
      callbackURL: '/oauth/kakao/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await findOauthUser(profile.id, profile.provider);

      if (!user) {
        const newUser = await createOauthUser({
          id: profile.id,
          email: profile._json.kakao_account.email,
          name: profile.username,
          provider: profile.provider,
        });

        await createToken({
          id: profile.id,
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        return done(null, newUser);
      } else {
        return done(null, user);
      }
    }
  )
);

// github strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: '/oauth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await findOauthUser(profile.id, profile.provider);

      if (!user) {
        const newUser = await createOauthUser({
          id: profile.id,
          email: profile._json.email,
          name: profile.username,
          provider: profile.provider,
        });

        await createToken({
          id: profile.id,
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        return done(null, newUser);
      } else {
        return done(null, user);
      }
    }
  )
);

export default passport;
