var express = require('express');
var router = express.Router();
var gravatar = require('gravatar');
var sha1 = require('sha1');

//session-cookie
var session = require('express-session')
var cookie = require('cookie-parser')

var db = require('../models/dbConnection')
var fs = require('fs');
var filepath2 = './public/images/bg.jpg'

var registerBgData = fs.readFileSync(filepath2);
var base64Str2 = registerBgData.toString('base64');
var registerBgUri = 'data:image/jpg;base64,'+ base64Str2;

router.get('/',function(req,res){
  res.render('register.ejs',{nameExisted:false,bg:registerBgUri});
})

router.post('/',function(req,res){
  var imageurl = gravatar.url(req.body.email, {s: '30', r: 'G', d: 'retro'},true);
  var password = sha1(req.body.password);

  var info = req.body.username+','+password+','+req.body.email+','+imageurl
  db.insertInfo('user',info,function(result){
    if(result){
      res.cookie('user', req.body.username, {          //通过res.cookie（）函数设置cookie

        httpOnly: true,        //客户端脚本不能访问cookie
        //domain: abc.com,       //设置主域名，可以跨域共享二级域名
        maxAge: 1000 * 60*60 * 24,       //设置cookie过期时间为 60秒
      });
      res.cookie('imageUrl', imageurl, {          //通过res.cookie（）函数设置cookie

        httpOnly: true,        //客户端脚本不能访问cookie
        //domain: abc.com,       //设置主域名，可以跨域共享二级域名
        maxAge: 1000 * 60*60 * 24,       //设置cookie过期时间为 60秒
      });
      res.redirect('/');
    }
  })

  // res.render('post.ejs',{url:url});
});

module.exports = router;