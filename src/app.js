import express from "express";
import cors from "cors";
import { KakaoClient } from "./kakao.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// api 생성
app.get("/kakao/url", (req, res, next) => {
    const url = KakaoClient.getAuthCodeURL();
    console.log("url", url);

    res.status(200).json({
        url,
      });
      
      console.log("/kakao/url finish");
});

// env 파일 : cid 값 테스트 rest api로 하기 !
//app.post




export default app;