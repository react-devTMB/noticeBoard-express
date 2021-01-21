const mongoose = require('mongoose');
const config = require('../config');

module.exports = async () => {
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
