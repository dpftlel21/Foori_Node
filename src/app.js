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
});

// env 파일 : cid 값 테스트 rest api로 하기 !
app.post('/login/kakao', async (req, res) => {
  const { code } = req.body;
  try {
      //console.log("code", code);
      const { access_token } = await KakaoClient.getAccessToken(code);
      const userData = await KakaoClient.getUserData(access_token);

      //DB 사용자 등록 처리, 토큰 및 로그인 처리
      const userCheckQuery = `SELECT * FROM MEMBER WHERE CID = ?`;
      const userExist = await DB.query(conn, userCheckQuery, [userData.id]);
      console.log("userExist", userExist);

      if(userExist.length === 0){
        const insertQuery = `INSERT INTO MEMBER (CID, EMAIL, NAME) VALUES (?, ?, ?)`;
        await DB.query(conn, insertQuery, [userData.id, userData.kakao_account.email, userData.properties.nickname]);
        console.log('사용자 추가');
      } else {
          // 이미 존재하는 사용자
          console.log('기존에 존재하는 사용자');
      }


      const token = createToken(userData);
      res.status(200).json({ token });
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
});

export default app;