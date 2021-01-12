import mongoose from 'mongoose';
import config from '../config/index.js';

export default async () => {
  await mongoose.connect(
    config.mongoUri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    () => console.log('Connected to Mongo DB')
  );
};
