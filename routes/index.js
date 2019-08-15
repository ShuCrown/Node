// var express = require('express');
// var router = express.Router();

// //session-cookie
// var session = require('express-session')
// var cookie = require('cookie-parser')

// var db = require('../models/dbConnection')
// var fs = require('fs');
// var filepath = './public/images/logo.jpg'
// var filepath2 = './public/images/bg.jpg'

// var logoData = fs.readFileSync(filepath);
// var base64Str = logoData.toString('base64');
// var datauri = 'data:image/jpg;base64,'+ base64Str;

// var registerBgData = fs.readFileSync(filepath2);
// var base64Str2 = registerBgData.toString('base64');
// var registerBgUri = 'data:image/jpg;base64,'+ base64Str2;

// //加密模块
// const crypto = require('crypto');
// const secret = 'abcdefg'

// router.use(session({
//   secret:'keyboard',
//   resave:false,
//   saveUninitialized: true,
//   cookie: {maxAge:60}
// }));

// /* GET home page. */
// router.get('/', function(req, res, next) {

//   console.log(req.session.cookie);
//  // console.log(req.session);
//   console.log(req.session.cookie._expires);
//   console.log(Date());
//   if(req.session.cookie.expires >Date()){
//     res.render('login.ejs',{title:'Login',hasError:false,logoUri:datauri});
//   }else{
//     res.render('index.ejs',{title:'ShuSite'});

//   }
// });

// router.get('/login',function(req,res){


//   res.render('login.ejs',{title:'Login',hasError:false,logoUri:'fa'});
// })

// router.post('/login',function(req,res){
//   req.session.username = req.body.username;
//    db.queryInfo('user',req.body.username,req.body.password,function(result){
//      if(result.msg){
//          res.redirect('/')
//      }else{
//          res.render('login.ejs',{title:'Login',hasError:true,logoUri:datauri})
//      }
//    })
// });

// router.get('/register',function(req,res){
//   res.render('register.ejs',{title:'Register',nameExisted:false,bg:registerBgUri});
// })

// router.post('/checkInfo',function(req,res){
//   if(req.body.path == 'username'){
//     db.checkInfo(req.body.path,req.body.username,function(result){
//       if(result.msg){
//         res.send({msg:'Username is already token.'});
//       }else{
//         res.send({msg:''});
//       }
//     });
//   }else{
//     db.checkInfo(req.body.path,req.body.email,function(result){
//       if(result.msg){
//         res.send({msg:'Email is invalid or already token.'});
//       }else{
//         res.send({msg:''});
//       }
//     });
//   } 
// })

// //注册请求前对用户信息进行crypto加密

// router.post('/register',function(req,res){
//   const reqStr = req.body.username+" "+req.body.email+" "+req.body.password;
//   const random = parseInt(Math.random()*100);
//   console.log(random);
//   console.log(crypto.getHashes());


//   // db.insertInfo(hash,function(result){
//   //   console.log(result);
//   // })
//   res.render('index.ejs',{title:'ShuSite',isLogin:true});
// });



// module.exports = router;
var session = require('express-session');
var cookies = require('cookie-parser');
// var RedisStore = require('connect-redis')(session);
// var options = {
//   "host": "127.0.0.1",
//   "port": "6379",
//   "ttl": 60,   //session的有效期为30天(秒)
// };

var db = require('../models/dbConnection')
var moment = require('moment');
module.exports = function (app) {
  // //session
  // app.use(session({
  //   name: 'user',// 设置 cookie 中保存 session id 的字段名称
  //   secret: 'website',// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  //   resave: true,// 强制更新 session
  //   saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
  //   cookie: {
  //     maxAge: 60 // 过期时间，过期后 cookie 中的 session id 自动删除
  //   },
  //   store: new RedisStore(options)
  // }));
  app.get('/', function (req, res, next) {
    if(req.cookies){
      db.getAllPosts(function(results){
        results.forEach(result => {
          result.create_at = moment(result.create_at).format('YYYY-MM-DD HH:mm')
        });
        res.render('index.ejs', { user: req.cookies.user,posts:results});
      })
    }else{
      res.render('index.ejs', { user: null,posts:null});
    }
  })


  app.use('/login', require('./login'))
  app.use('/register', require('./register'))
  app.use('/logout', require('./logout'))
  app.post('/checkInfo', function (req, res) {
    if (req.body.path == 'username') {
      db.checkInfo(req.body.path, req.body.username, function (result) {
        if (result.msg) {
          res.send({ msg: 'Username is already token.' });
        } else {
          res.send({ msg: '' });
        }
      });
    } else {
      db.checkInfo(req.body.path, req.body.email, function (result) {
        if (result.msg) {
          res.send({ msg: 'Email is invalid or already token.' });
        } else {
          res.send({ msg: '' });
        }
      });
    }
  })
  app.use('/post', require('./post'))
  //  app.use('comment',require('./comment'))


}