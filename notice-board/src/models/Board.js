import mongoose from 'mongoose';

const BoardSchema = mongoose.Schema({
  title: String,
  contents: String,
  author: String,
  reg_date: { type: Date, default: Date.now },
});

const BoardModel = mongoose.model('Board', BoardSchema);
export default BoardModel;
