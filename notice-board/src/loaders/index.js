import expressLoader from './express.js';
import mongooseLoader from './mongoose.js';

export default async ({ expressApp }) => {
  await expressLoader({ expressApp });
  console.log('Express Initialized');

  await mongooseLoader();
  console.log('MongoDB Initialized');
};
