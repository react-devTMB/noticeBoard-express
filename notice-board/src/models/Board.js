const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  seq: { type: Number, required: true },
  category: { type: String, required: true },
});

boardSchema.plugin(AutoIncrement, {
  inc_field: 'seq',
});

module.exports = mongoose.model('Board', boardSchema);
