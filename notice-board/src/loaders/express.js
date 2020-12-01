import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import createError from 'http-errors';

import config from '../config/index.js';
import constant from '../constant/index.js';
import { stream } from '../config/logger.js';

import passport from '../middlewares/passport.js';

import oauthRoutes from '../api/oauth.js';
import userRoutes from '../api/user.js';

export default async ({ expressApp: app }) => {
  // init config
  app.set('port', config.port);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  switch (config.profile) {
    case constant.PROFILE.DEV:
      app.use(morgan('combine', { stream }));
      break;

    case constant.PROFILE.PROD:
      app.use(
        morgan('tiny', {
          skip: (req, res) => res.statusCode < 400,
          stream,
        })
      );
      break;
  }
  app.use(cors());
  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // define route for health check
  app.get('/status', (req, res) => res.status(200).end());
  app.head('/status', (req, res) => res.status(200).end());
  app.enable('trust proxy');

  // define routes
  app.use('/oauth', oauthRoutes);

  app.use('/api/user', userRoutes);

  // catch 404(not found) and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === constant.PROFILE.DEV ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ message: 'error' });
  });

  return app;
};
