import nodemailer from 'nodemailer';
import crypto from 'crypto';

// node mailer 설정
const smtpTransport = nodemailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    auth: {
        user: process.env.NAVER_EMAIL_ID,
        pass: process.env.NAVER_EMAIL_PW
    }
});

// 이메일 토큰 발급 함수
const createToken = () => {
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);
    return { token, expires };
};

// 이메일 인증 링크 전송 함수
export const sendLink = async (req, res) => {
    try {
        const { email } = req.body;
        const result = createToken();
        const mailOptions = {
            from: process.env.NAVER_EMAIL_ID,
            to: email,
            subject: '이메일 인증 링크입니다.',
            text: `http://localhost:3000/signup/email/${result.token}`
        };

        await smtpTransport.sendMail(mailOptions);
        res.json({ ok: 'true', msg: '메일이 전송되었습니다.', token: result.token });


    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ ok: 'false', msg: '메일 전송에 실패했습니다.' });
    } finally {
        smtpTransport.close();
    }
};
