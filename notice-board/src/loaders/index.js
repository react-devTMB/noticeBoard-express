const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');

module.exports = async ({ expressApp }) => {
  await expressLoader({ expressApp });
  console.log('Express Initialized');

  await mongooseLoader();
  console.log('MongoDB Initialized');
};
