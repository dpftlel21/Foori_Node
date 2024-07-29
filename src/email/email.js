import nodemailer from 'nodemailer';
import crypto from 'crypto';


// node mailer 설정
export const smtpTransport = nodemailer.createTransport({
    pool : 'true',
    maxConnections : 1,
    service : 'naver',
    host : 'smtp.naver.com',
    port : 465,
    secure: false,
    requireTLS: true,
    auth : {
        user : process.env.EMAIL_ID,
        pass : process.env.EMAIL_PW
    },
    tls: {
        rejectUnauthorized: false
    }
});


// // 인증번호 생성
// let randomNum = function (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }


// // 이메일 인증번호 전송

// export const sendEmail = async (req, res) => {
//     const number = randomNum(111111, 999999);

//     const { email } = req.body;

//     const mailOptions = {
//         from : process.env.EMAIL_ID,
//         to : email,
//         subject : '이메일 인증번호입니다.',
//         text : `인증번호 : ${number}`
//     }
// }


// smtpTransport.sendMail(mailOptions, (error, responses) => {
//     if(error) {
//         res.json({ok: 'false', msg : '메일 전송에 실패했습니다.'});
//         smtpTransport.close();
//     } else {
//         res.json({ok: 'true', msg : '메일이 전송되었습니다.', number : number});
//         smtpTransport.close();
//     }
// });


// 이메일 토큰 발급
const createToken = async () => {

    const token = crypto.randomBytes(20).toString('hex');
    console.log('token', token);
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    return { token, expires };

};

// 인증 링크
export const sendLink = async (req, res) => {
    const result = await createToken();
    const { email } = req.body;

    const mailOptions = {
        from : process.env.EMAIL_ID,
        to : email,
        subject : '이메일 인증 링크입니다.',
        text : `http://localhost:3000/signup/email/${result.token}`
    };

    console.log('mailOptions', mailOptions);

    smtpTransport.sendMail(mailOptions, (error, responses) => {
        if(error) {
            console.log(error);
            responses.json({ok: 'false', msg : '메일 전송에 실패했습니다.'});
            smtpTransport.close();
        } else {
            responses.json({ok: 'true', msg : '메일이 전송되었습니다.', token : result.token});
            smtpTransport.close();
        }
    });
};