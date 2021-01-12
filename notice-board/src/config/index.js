import dotenv from 'dotenv';

// get config from .env file
dotenv.config();

export default {
  profile: process.env.NODE_ENV,

  port: process.env.PORT,

  sessionSecret: process.env.SESSION_SECRET,

  mongoUri: process.env.MONGO_URI,

  logger: {
    level: 'info',
    dir: 'logs',
  },

  security: {
    usernameField: 'email',
    passwordField: 'password',
  },

  oauth: {
    facebook: {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    },
    kakao: {
      clientID: process.env.KAKAO_ID,
      clientSecret: process.env.KAKAO_SECRET,
    },
    github: {
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    },
    google: {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    },
  },
};