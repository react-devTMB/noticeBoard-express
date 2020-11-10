import jwt from 'jsonwebtoken';
// import UserModel from '../models/User';

const jwtMiddleware = (req, res, next) => {
    console.log('jwtMiddleware req >> ' ,req,  req.headers['access_token']);
    // token있는지 체크
    const token = req.token;

    if(!token) return next();

    try {
        // 토큰이 있다면 verify
        // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decodedToken);
        // const now = Math.floor(Date.now() / 1000);
        // res.state.user = {
            //     _id : decodedToken.id,
            //     email : decodedToken.email,
            //     name : decodedToken.name,
            //     role_id : decodedToken.role_id
            // }
        // // 토큰 남은 유효기간이 3일이면 재발급
        // if(decodedToken.exp - now < 60 * 60 * 24 * 3) {
        //     const user = UserModel.findByEmail(decodedToken.email);
        //     const token = user.generateToken();
        //     // token setting
        // }
        return next();
    } catch(e) {
        return next();
    }

    // const token = 
};

export default jwtMiddleware;