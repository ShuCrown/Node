var express = require('express');
var router = express.Router();

//session-cookie
var session = require('express-session')
var cookie = require('cookie-parser')
var flash = require('connect-flash')

var moment = require('moment')

var db = require('../models/dbConnection')
var post = require('../models/post');

router.get('/',function(req,res){
  res.render('posts.ejs',{error:false,imageUrl:req.cookies.imageUrl,user:req.cookies.user});
})

router.post('/',function(req,res){
  const title = req.body.title;
  const content = req.body.content;
  const create_at = moment().format('YYYY-MM-DD HH:mm');
  const info = req.cookies.user+','+ title + ','+ content+','+ create_at;
  try{
    if(!title.length && !content.length){
      throw new Error('请填写完整信息')
    }else{
      db.insertInfo('posts',info,function(result){
        if(result){
          res.redirect('/');
        }
      })
    }
  }catch(e){   
    res.render('posts.ejs',{error:true,imageUrl:req.cookies.imageUrl,user:req.cookies.user})
  }
});

router.get('/:id',function(req,res){
  const postId = req.params.id;
  var p = new Promise(function(resovle,reject){
    resovle( post.getPostById(postId));
  });
  p.then(function(result){
    var post = [];
    post.id = result.id;
    post.author = result.author;
    post.title = result.title;
    post.content = result.content;
    post.pv = result.pv
    post.create_at = moment(result.create_at).format('YYYY-MM-DD HH:mm')
    res.render('post.ejs',{
      post:post
    })
  })
})

module.exports = router;

