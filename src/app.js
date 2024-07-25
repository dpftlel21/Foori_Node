import express from "express";
import cors from "cors";
import { DB } from "./mysql.js";
import { KakaoClient } from "./oauth/kakao.js";
import { NaverClient } from "./oauth/naver.js";
import { GoogleClient } from "./oauth/google.js";
import { createToken } from "./jwt/jwt.js";



const app = express();
const conn = DB.init();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

DB.connect(conn);

// 카카오 api 생성
app.get("/url/kakao", (req, res, next) => {
    const url = KakaoClient.getAuthCodeURL();

    res.status(200).json({
        url,
      });
});

// 네이버 api 생성
app.get("/url/naver", (req, res, next) => {
  const url = NaverClient.getAuthCodeURL();

  //console.log("naverurl", url);

  res.status(200).json({
    url,
    });
});

// 구글 api 생성
app.get("/url/google", (req, res, next) => {
  const url = GoogleClient.getAuthCodeURL();

  console.log("googleurl", url);

  res.status(200).json({
    url,
    });
});

// 카카오 로그인
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
        const insertQuery = `INSERT INTO MEMBER (CID, EMAIL, NAME, OAUTH_KIND) VALUES (?, ?, ?, ?)`;
        await DB.query(conn, insertQuery, [userData.id, userData.kakao_account.email, userData.properties.nickname, 'kakao']);
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

// 네이버 로그인
app.post('/login/naver', async (req, res) => {
  //console.log("req.body", req.body);
  const { code } = req.body;
  try {
      const { access_token } = await NaverClient.getAccessToken(code);
      const userData = await NaverClient.getUserData(access_token);
      //console.log("userData", userData);

      //DB 사용자 등록 처리, 토큰 및 로그인 처리
      const userCheckQuery = `SELECT * FROM MEMBER WHERE CID = ?`;
      const userExist = await DB.query(conn, userCheckQuery, [userData.response.id]);

      if(userExist.length === 0){
        const insertQuery = `INSERT INTO MEMBER (CID, EMAIL, NAME, PHONENUMBER, OAUTH_KIND) VALUES (?, ?, ?, ?, ?)`;
        await DB.query(conn, insertQuery, [userData.response.id, userData.response.email, userData.response.name, userData.response.mobile, 'naver']);
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

// 구글 로그인
app.post('/login/google', async (req, res) => {
  //console.log("req.body", req.body);
  const { code } = req.body;
  try {
      const { access_token } = await GoogleClient.getAccessToken(code);
      const userData = await GoogleClient.getUserData(access_token);
      console.log("userData", userData);

      //DB 사용자 등록 처리, 토큰 및 로그인 처리
      const userCheckQuery = `SELECT * FROM MEMBER WHERE CID = ?`;
      const userExist = await DB.query(conn, userCheckQuery, [userData.id]);

      if(userExist.length === 0){
        const insertQuery = `INSERT INTO MEMBER (CID, EMAIL, NAME, OAUTH_KIND) VALUES (?, ?, ?, ?)`;
        await DB.query(conn, insertQuery, [userData.id, userData.email, userData.name, 'google']);
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