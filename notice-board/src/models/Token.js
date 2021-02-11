const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  email: { type: String, required: true },
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
});

module.exports = mongoose.model('Token', tokenSchema);
