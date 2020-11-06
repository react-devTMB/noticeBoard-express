import OauthModel from '../models/Oauth.js';

export const findOauthUser = (id, provider) => {
  return OauthModel.findOne({ id, provider });
};

export const createOauthUser = (user) => {
  const oauthModel = new OauthModel(user);
  return oauthModel.save();
};
