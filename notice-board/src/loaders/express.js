const express = require('express');
// const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const createError = require('http-errors');

const config = require('../config');
const passport = require('passport');
// const { stream } = require('../logger');

const passportConfig = require('../config/passport');

// const oauthRoutes = require('../routers/oauth');
const userRouter = require('../routers/user');
const postRouter = require('../routers/post');
const commentRouter = require('../routers/comment');

module.exports = async ({ expressApp: app }) => {
  // init config
  app.set('port', config.port);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // switch (config.profile) {
  //   case 'development':
  //     app.use(morgan('combine', { stream }));
  //     break;

  //   case 'production':
  //     app.use(
  //       morgan('tiny', {
  //         skip: (req, res) => res.statusCode < 400,
  //         stream,
  //       })
  //     );
  //     break;
  // }
  app.use(cors());
  // app.use(
  //   session({
  //     secret: config.sessionSecret,
  //     resave: false,
  //     saveUninitialized: false,
  //   })
  // );
  app.use(passport.initialize());
  passportConfig();

  // define route for health check
  app.get('/status', (req, res) => res.status(200).end());
  app.head('/status', (req, res) => res.status(200).end());
  app.enable('trust proxy');

  // define routes
  // app.use('/oauth', oauthRoutes);

  app.use(`${config.apiPrefix}`, userRouter);
  app.use(`${config.apiPrefix}`, postRouter);
  app.use(`${config.apiPrefix}`, commentRouter);

  // catch 404(not found) and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ message: 'error' });
  });

  return app;
};
