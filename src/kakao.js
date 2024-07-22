const KakaoClient = {
    key: process.env.KAKAO_KEY,
    redirectUri: 'http://localhost:3000/callback/kakao',
    getAuthCodeURL() {
      return `https://kauth.kakao.com/oauth/authorize?client_id=${this.key}&redirect_uri=${this.redirectUri}&response_type=code`;
    },
    async getAccessToken(code) {
        const params = {
          client_id: this.key,
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        };
        console.log("params", params);

        const response = await fetch('https://kauth.kakao.com/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(params),
        });

        const data = await response.json();
        console.log("data", data);

        const tokenData = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        };

        return tokenData;
    },
    async getUserData(token){
        const response = await fetch('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("data", data);

        return data;

        const userData = {
          id: data.id,
          email: data.kakao_account.email,
          nickname: data.properties.nickname,
          profile_image: data.properties.profile_image,
        };
        console.log("userData", userData);
        return userData;
    }   
  };
  
  export { KakaoClient };