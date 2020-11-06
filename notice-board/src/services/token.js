import TokenModel from '../models/Token.js';

export const createToken = (token) => {
  const tokenModel = new TokenModel(token);
  return tokenModel.save();
};
