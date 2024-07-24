import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY;

const createToken = (payload) => {
    // jwt.sign 메서드 => 토큰 발행 , 1시간 서버에서 유효
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    //console.log("created token", token);
};

// refresh token
const refreshToken = (token) => {
    try{
        // 토큰 유효성 검사
        const decoded = jwt.verify(token, secretKey);
        const { iat, exp } = decoded;
        const now = Math.floor(Date.now() / 1000);

        // 토큰 만료 10분 전
        if(exp - now < 600){
            const payload = {
                id: decoded.id,
                email: decoded.email,
            };
            const newToken = createToken(payload);
            return newToken;
        }
        return token;
    }
    catch(err){
        console.log("err", err);
        return null;
    }
};

export { createToken, refreshToken };