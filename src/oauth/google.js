

const GoogleClient = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    getAuthCodeURL() {
        return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&response_type=code&scope=email%20profile`;
    },
    async getAccessToken(code) {
        const params = {
            client_id: this.client_id,
            client_secret: this.client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: this.redirect_uri,
        };
        //console.log("params", params);
        
        const response = await fetch('https://oauth2.googleapis.com/token', {
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
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        console.log("userData", data);

        return data;
    }
};

export { GoogleClient };
