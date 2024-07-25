import crypto from 'crypto';


const NaverClient = {
    client_id: process.env.NAVER_CLIENT_ID,
    client_secret: process.env.NAVER_CLIENT_SECRET,
    redirect_uri: process.env.NAVER_REDIRECT_URI,
    state: Math.random().toString(36),
    getNaverAuthCodeURL() {
        return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${this.client_id}&state=${this.state}&redirect_uri=${this.redirect_uri}`;
    },
    async getAccessToken(code) {
        const params = {
            client_id: this.client_id,
            client_secret: this.client_secret,
            state: this.state,
            code,
            grant_type: 'authorization_code',
            redirect_uri: this.redirect_uri,
        };
        //console.log("params", params);
        
        const response = await fetch('https://nid.naver.com/oauth2.0/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(params),
        });

        const data = await response.json();
        //console.log("data", data);

        const tokenData = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
        };

        return tokenData;
    },
    async getUserData(token) {
        const response = await fetch('https://openapi.naver.com/v1/nid/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        console.log("userData", data);

        return data;
    }
};

export { NaverClient };
