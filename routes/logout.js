var express = require('express');
var router = express.Router();

//session-cookie
var session = require('express-session')
var cookie = require('cookie-parser')

router.get('/',function(req,res){
  res.clearCookie('user')
  res.clearCookie('imageUrl')
  res.redirect('/')
})

module.exports = router;

