import express from 'express';
import passport from '../config/passport.js';
import request from 'request';
import { createOauthUser, findOauthUser, readProfile } from '../services/oauth.js';
import { createToken } from '../services/token.js';

const router = express.Router();

// facebook login
router.get(
  '/facebook',
  passport.authenticate('facebook', {
    authType: 'rerequest',
    scope: ['public_profile', 'email'],
  })
);

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: 'http://localhost:3001/login' }), function (req, res) {

  res.redirect('http://localhost:3001/home');
});

// kakao login
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: 'http://localhost:3001/login' }), function (req, res) {
  res.redirect('http://localhost:3001/home');
});

// github login
router.get('/github', passport.authenticate('github'));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: 'http://localhost:3001/login' }), function (req, res) {
  res.redirect('http://localhost:3001/home');
});

// naver login
router.post("/naver/callback", async (req, res) => {

  const { code, state } = req.body;

  const options = {
    uri : "https://nid.naver.com/oauth2.0/token",
    method: 'POST',
    form : {
      grant_type : 'authorization_code',
      client_id : process.env.NAVER_ID,
      client_secret : process.env.NAVER_SECRET,
      code : code,
      state : state
    },
  };

  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;  // corsError

  request.post(options, async function (err, response, body) {

    if(body !== null && body !== undefined ) {
      const accessToken = JSON.parse(body).access_token;
      const refreshToken = JSON.parse(body).refresh_token;
      // console.log('accessToken,  refreshToken >> ' , accessToken, refreshToken);
      if(!err && response.statusCode === 200) {

        const result = await readProfile('naver', body);
        // console.log('result >> ' , result);
        if(result !== null && result !== undefined) {
          const resData = JSON.parse(result);
          if(resData.message === "success") {
            const user = await findOauthUser(resData.response.id, 'naver');
            if(!user) {               // user 정보 없는 경우
              await createOauthUser({
                id: resData.response.id,
                email: resData.response.email,
                name: resData.response.nickname,
                provider: 'naver',
              });
              await createToken({
                id: resData.response.id,
                access_token: accessToken,
                refresh_token: refreshToken,
              });
            }
            res.writeHead(200,
            {
              'result' : true,
              'access_token' : accessToken,
              'refresh_token' : refreshToken ,
              'Content-Type': 'text/json;charset=utf-8',
              'authLogin' : "Y"
            });
            resData.response["authLogin"] = "Y";
            resData.response["provider"] = "naver";

            res.end(JSON.stringify(resData));
          }
        } else {
          res.status(500).end();
        }

      } else {
        if(response != null) {
          res.status(response.statusCode).end();
        }
      }
    } else {
      res.status(500).end();
    }
  });
});

export default router;
