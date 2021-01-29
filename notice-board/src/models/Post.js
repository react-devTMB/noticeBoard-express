const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const userInfo = require('./_userInfo');

const postSchema = new Schema(
  {
    seq: { type: Number, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    view_cnt: { type: Number, required: true, default: 0 },
    delete_yn: { type: String, required: true, default: 'N' },
    ...userInfo,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: {
      createdAt: 'created_date',
      updatedAt: 'updated_date',
    },
  }
);

/**
 * plugin
 */
postSchema.plugin(AutoIncrement, {
  inc_field: 'seq',
});

module.exports = mongoose.model('Post', postSchema);
