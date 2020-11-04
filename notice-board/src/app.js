import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import createError from 'http-errors';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

dotenv.config();

// App config
const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
app.set('port', port);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// DB config
mongoose.connect(
  mongoUri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log('  Connected to Mongo DB')
);

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //   res.render('error');
  res.json({ message: 'error' });
});

export default app;