const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const BaseInfo = require('./_baseInfo');

const postSchema = new Schema({
  seq: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  view_cnt: { type: Number, required: true, default: 0 },
  delete_yn: { type: String, required: true, default: 'N' },
  ...BaseInfo,
  _board: { type: Schema.Types.ObjectId, ref: 'Board', index: true },
});

postSchema.plugin(AutoIncrement, {
  inc_field: 'seq',
});

module.exports = mongoose.model('Post', postSchema);
