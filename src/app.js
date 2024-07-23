import express from "express";
import cors from "cors";
import { DB } from "./mysql.js";
import { KakaoClient } from "./kakao.js";
import { createToken } from "./jwt/jwt.js";



const app = express();
const conn = DB.init();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

DB.connect(conn);

// api 생성
app.get("/kakao/url", (req, res, next) => {
    const url = KakaoClient.getAuthCodeURL();
    //console.log("url", url);

    res.status(200).json({
        url,
      });
      
      //console.log("/kakao/url finish");
});

// env 파일 : cid 값 테스트 rest api로 하기 !
app.post('/login/kakao', async (req, res) => {
  const { code } = req.body;
  try {
      const { access_token } = await KakaoClient.getAccessToken(code);
      const userData = await KakaoClient.getUserData(access_token);
      const token = createToken(userData);
      res.status(200).json({ token });
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
});

export default app;