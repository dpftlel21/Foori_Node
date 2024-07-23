import jwt from 'jsonwebtoken';
import { refreshToken } from './jwt';


// jwt token을 새로 고치는 미들웨어

const refreshMiddleware = (req, res, next) => {
    // 요청에 대한 토큰 가져오기
    const token = req.cookies.token;

    if(token){
      // 토큰 새로고침
      const newToken = refreshToken(token);
      
      // 새 토큰이 존재할 때 쿠키에 저장
      if(newToken){
        res.cookie('token', newToken, { httpOnly: true , maxAge: 3600000 });
      }

      next();
    };
};

export {refreshMiddleware};