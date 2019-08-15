var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

//session-cookie
var session = require('express-session')
var cookie = require('cookie-parser')

var db = require('../models/dbConnection')
var fs = require('fs');
var filepath = './public/images/logo.jpg'

var logoData = fs.readFileSync(filepath);
var base64Str = logoData.toString('base64');
var datauri = 'data:image/jpg;base64,' + base64Str;

var secret = 'secret';

router.get('/', function (req, res) {
  res.render('login.ejs', { hasError: false, logoUri: datauri });
})

router.post('/', function (req, res) {
  var password = sha1(req.body.password);
  res.cookie('user', req.body.username, {          //通过res.cookie（）函数设置cookie

    httpOnly: true,        //客户端脚本不能访问cookie
    //domain: abc.com,       //设置主域名，可以跨域共享二级域名
    maxAge: 1000 * 60 * 60 * 24,       //设置cookie过期时间为 60秒
  });
  //req.signedCookies = signedCookies(res.cookies,secret);

  db.queryInfo('user', req.body.username, password, function (result) {
    if (result.msg) {
      db.getImage(req.body.username,function(imageurl){
        var imageUrl = imageurl.split('"')[1];
        console.log('1:'+imageUrl);
        res.cookie('imageUrl', imageUrl, {
          httpOnly: true,        //客户端脚本不能访问cookie
          //domain: abc.com,       //设置主域名，可以跨域共享二级域名
          maxAge: 1000 * 60 * 60 * 24,       //设置cookie过期时间为 60秒
        })
        res.redirect('/')
      })
      
    } else {
      res.render('login.ejs', { hasError: true, logoUri: datauri })
    }
  })
});

module.exports = router;

