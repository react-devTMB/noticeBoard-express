import request from 'request';
import OauthModel from '../models/Oauth.js';

export const findOauthUser = (id, provider) => {
  return OauthModel.findOne({ id, provider });
};

export const createOauthUser = (user) => {
  const oauthModel = new OauthModel(user);
  return oauthModel.save();
};

// profile 가져오기
export const readProfile = async (type, data) => {

  let options_profile = {};
  let resData = JSON.parse(data);
  const accessToken = resData.access_token;
  const header = "Bearer " + accessToken;
  switch (type) {
    case 'naver':
      options_profile = {
        url : "https://openapi.naver.com/v1/nid/me",
        headers: { 'Authorization': header }
      }
      break;
    default:
      break;
  }

  try {
    const result = await new Promise((resolve) => {
      request.get(options_profile, (error, response, body) => {
        resolve(body);
      });
    });
    return result;
  } catch (err) {
    console.error(err);
  }

};
