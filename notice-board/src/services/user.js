import UserModel from '../models/User.js';

export const findUser = (email) => {
  return UserModel.findOne({ email });
};

export const findUserById = (_id) => {
  return UserModel.findById({ _id });
};

export const createUser = (user) => {
  const userModel = new UserModel(user);
  return userModel.save();
};
