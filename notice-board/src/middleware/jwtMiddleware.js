import jwt from 'jsonwebtoken';
// import UserModel from '../models/User';

const jwtMiddleware = (req, res, next) => {
    // console.log('jwtMiddleware req >> ' , req.headers['authorization']);
    // token있는지 체크
    const token = req.headers['authorization'];

    if(!token) return next();

    try {
        // 토큰이 있다면 verify
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('decodedToken >> ' , decodedToken);
        const now = Math.floor(Date.now() / 1000);
        res.state.user = {
            _id : decodedToken.id,
            email : decodedToken.email,
            name : decodedToken.name,
            role_id : decodedToken.role_id
        }
        // 토큰 남은 유효기간이 3일이면 재발급
        if(decodedToken.exp - now < 60 * 60 * 24 * 3) {
            return res.status(401).json({ success: false, message: 'Expired token' });
        }
        return next();
    } catch(e) {
        return next();
    }

};

export default jwtMiddleware;