const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const BaseInfo = require('./_baseInfo');

const commentSchema = new Schema({
  seq: { type: Number, required: true },
  content: { type: String, required: true },
  ...BaseInfo,
  _post: { type: Schema.Types.ObjectId, ref: 'Post', index: true },
});

commentSchema.plugin(AutoIncrement, {
  inc_field: 'seq',
});

module.exports = mongoose.model('Comment', commentSchema);
