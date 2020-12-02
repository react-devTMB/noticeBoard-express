import express, { response } from 'express';
import passport from '../config/passport.js';
import logger from '../config/logger.js';
import request from 'request';

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



router.get("/naver", (req, res) => {
  const { code, state } = req.query;
  console.log(code, state);
  const options = {
    uri : "https://nid.naver.com/oauth2.0/token",
    qs : {
      grant_type : 'authorization_code',
      client_id : process.env.NAVER_ID,
      client_secret : process.env.NAVER_SECRET,
      code : code,
      state : state
    }
  };

  request(options, function (err, res, body) {
    console.log(body);
    // response.render()
    // callback
    // console.log(req.header);
    // return res.status(200).json({ success: true, body : body });
      // response.render("http://localhost:3000/login", { result : 1, body: body });

  })

});


router.post("/naver/callback", (req, res) => {

  const { code, state } = req.body;
  console.log(code, state);

  // const options = {
  //   uri : "https://nid.naver.com/oauth2.0/token",
  //   qs : {
  //     grant_type : 'authorization_code',
  //     client_id : process.env.NAVER_ID,
  //     client_secret : process.env.NAVER_SECRET,
  //     code : code,
  //     state : state
  //   }
  // };
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
  }
  request.post(options, function (err, response, body) {
    // callback
    console.log(body);
    return res.status(200).json({body : body});
  })




  // request({ 
  //   method: "POST", 
  //   uri: "https://nid.naver.com/oauth2.0/token",
  //   grant_type : 'authorization_code',
  //   client_id : process.env.NAVER_ID,
  //   client_secret : process.env.NAVER_SECRET,
  //   code : code,
  //   state : state
  // },function(error, response, body) { 
  //   console.log('res >> ' , response, body);
  //   // console.log(body); 
  // });


});

// router.get(
//   '/naver',
//   passport.authenticate('naver', {
//     state : "123qwqwqw4"
//   }), function (req, res) {
//     console.log('req, res >> ' , req, res);
//     // res.redirect('http://localhost:3000/home');
//   }
// );
// router.get('/naver', function(req, res) {
//   res.render(req);
// 	// res.render('index', { user: req.user });
// // });
// router.get('/naver', passport.authenticate('naver', function (req, res) {
//   console.log('res >> ' , res);
//   res.redirect('http://localhost:3000/home');
// });
// {
//   authType: 'rerequest',
//   scope: ['public_profile', 'email'],
// }
// router.get('/naver', passport.authenticate('naver', null), function(req, res) {
//   console.log('/auth/naver failed, stopped >> ' , req , res);
// });
// router.get('/naver', passport.authenticate('naver'));
// router.get('/naver', passport.authenticate('naver', {
//   authType: 'rerequest',
//   scope: ['public_profile', 'email'],
// }), function (req, res) {
//   console.log('req, res >> ' , req, res);
//   res.redirect('http://localhost:3000/home');
// });

// router.get('/naver/callback', passport.authenticate('naver', { failureRedirect: 'http://localhost:3001/oauth/naver/callback' }), function (req, res) {
//   console.log('req, res >> ' , req, res);
//   // res.redirect('http://localhost:3000/home');
// });


export default router;
