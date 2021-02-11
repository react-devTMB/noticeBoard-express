const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const userInfo = require('./_userInfo');

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    delete_yn: { type: String, required: true, default: 'N' },
    ...userInfo,
  },
  {
    timestamps: {
      createdAt: 'created_date',
      updatedAt: 'updated_date',
    },
  }
);

module.exports = mongoose.model('Comment', commentSchema);
