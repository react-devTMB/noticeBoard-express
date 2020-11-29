import UserModel from '../models/User.js';
import passport from '../config/passport.js';

export const userRegist = async (req, res) => {
  const { email } = req.body;
  const user = await findUser(email);

  if (!user) {
    await createUser(req.body);
    res.status(200).json({ success: true });
  } else {
    res.status(309).json({ success: false, message: '이미 등록된 email 입니다.' });
  }
};

export const userLogin = async (req, res, next) => {
  //passport-local 인증 시도
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(500).json({ ...info, success: false });

    // customCallback 사용시 req.logIn()메서드 필수
    // 로그인에 성공한 경우, passport에서 user정보를 session에 저장하고 req.user으로 접근 가능
    // customCallback에서는 user 인자와 req.user와 동일
    req.logIn(user, function (err) {
      if (err) return next(err);

      return res.status(200).send({ success: true });
    });
  })(req, res, next);
};

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
