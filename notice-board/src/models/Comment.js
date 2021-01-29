const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const userInfo = require('./_userInfo');

const commentSchema = new Schema(
  {
    seq: { type: Number, required: true },
    content: { type: String, required: true },
    ...userInfo,
    _post: { type: Schema.Types.ObjectId, ref: 'Post', index: true },
  },
  {
    timestamps: {
      createdAt: 'created_date',
      updatedAt: 'updated_date',
    },
  }
);

commentSchema.plugin(AutoIncrement, {
  inc_field: 'seq',
});

module.exports = mongoose.model('Comment', commentSchema);
