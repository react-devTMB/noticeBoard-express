import mongoose from 'mongoose';

const TokenSchema = mongoose.Schema({
  id: { type: String, required: true },
  access_token: { type: String, required: true },
  refresh_token: { type: String },
});

const TokenModel = mongoose.model('Token', TokenSchema);
export default TokenModel;
