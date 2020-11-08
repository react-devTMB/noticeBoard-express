import UserModel from '../models/User.js';
import passport from '../config/passport.js';
import Joi from 'joi';
import { ADMIN_EMAIL } from '../common/util.js';


/**
 * POST /user/signup
 * 회원가입
 */
export const userRegist = async (req, res) => {
  console.log(JSON.stringify(req.body));
  let { email, name, role_id } = req.body;

  // 해당 이메일만 admin 나머지는 user
  ADMIN_EMAIL.includes(email) ? req.body.role_id = "admin" : req.body.role_id = "user" ;
  role_id = req.body.role_id;
  // request body내용 검증
  const checkSchema = Joi.object().keys({
    name : Joi.string().max(8).required(),
    password: Joi.string().min(8).max(16).required(),
    email : Joi.string().required(),
    role_id : Joi.string().required()
  });
  
  const result = checkSchema.validate(req.body);
  if(result.error) {
    res.body = result.error;
    return res.status(400).json({ success: false, message: 'Required error' });
  }

  try {
    const hasEmail = await findUser(email);
    const hasName = await findUserName(name);
  
    // email, nickname 존재여부 체크
    if (!hasEmail && !hasName) {
      await createUser(req.body);
      res.status(200).json({ success: true, body : res.body });
    } else {
      if(hasEmail) {
        res.status(200).json({ success: false, errorTxt : 'This email is already registered' });
      } else {
        res.status(200).json({ success: false, errorTxt : 'This nickname is already registered'});
      }
    }
  } catch(e) {
    res.status(500).json(e);
  }
  
 
};

/**
 * POST /user/login
 * 로그인
 */
export const userLogin = async (req, res) => {
  console.log('req >> ' , req);
  const { email, password} = req.body;

  console.log('email', email, 'password' , password );

  if(!email) {
    return res.status(200).json({ success: false, errorTxt : 'Required email' });
  }

  if(!password) {
    return res.status(200).json({ success: false, errorTxt : 'Required password' });
  }

  try {
    // 계정이 없는 경우
    const hasEmail = await findUser(email);
    // const checkPassword = await hasEmail.comparePassword(password);

    
     console.log('hasEmail', hasEmail );

    if(!hasEmail) {
      return res.status(200).json({ success: false, errorTxt : 'The email does not exist.' });
    } else {
      res.status(200).json({ success: true });

    }

    // if(!checkPassword) {
    //   return res.status(200).json({ success: false, errorTxt : 'Incorrect password.' });
    // }

    // if(hasEmail && checkPassword) {
    // }




  } catch(e) {
    res.status(500).json(e);
  }
}

// passport login
export const passportLogin  = async (req, res, next) => {
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

export const findUserName = (name) => {
  return UserModel.findOne({ name });
};

export const findUserById = (_id) => {
  return UserModel.findById({ _id });
};

export const createUser = (user) => {
  const userModel = new UserModel(user);
  return userModel.save();
};
