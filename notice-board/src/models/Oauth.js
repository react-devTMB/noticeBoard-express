import mongoose from 'mongoose';

const OauthSchema = mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, lowercase: true },
  name: { type: String, required: true },
  provider: { type: String, required: true },
  reg_date: { type: Date, default: Date.now },
  last_login: { type: Date },
  role_id: { type: String, default: 'user' },
});

const OauthModel = mongoose.model('Oauth', OauthSchema);
export default OauthModel;
