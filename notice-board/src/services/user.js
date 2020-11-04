import mongoose from 'mongoose';
import UserModel from '../models/User.js';

export default class UserService {
  findUser(email) {
    return UserModel.findOne({ email });
  }

  createUser(user) {
    const userModel = new UserModel(user);
    return userModel.save();
  }
}
