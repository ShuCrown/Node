var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var RedisStore = require('connect-redis')(session);
var flash = require('connect-flash');

var router = require('./routes');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));


var options = {
    "host": "127.0.0.1",
    "port": "6379",
    "ttl": 60*60*30,   //session的有效期为30天(秒)
};

//session
app.use(session({
    name:'user',// 设置 cookie 中保存 session id 的字段名称
    secret:'website',// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave:true,// 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie:{
        maxAge: 60 // 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new RedisStore(options)
}));

app.use(flash());

router(app);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
