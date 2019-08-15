var mysql = require('mysql')
const crypto = require('crypto');
const secret = 'abcdefg';
//const decipher = crypto.createDecipher('sha256',secret);

function GetConnection() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'nodejs'
    });
    return connection;

}
module.exports = {
    queryInfo : function queryInfo(table, username, password, callback) {
        var connection = GetConnection();
        connection.connect()
        connection.query('select id as `id` from ' + table + ' where username="' + username + '" and password="' + password + '"', function (error, results, fields) {
            if (typeof results[0] != "undefined") {
                callback && callback({ msg: true });
            } else {
                callback && callback({ msg: false });
            }
        })
        connection.end();
    },

    checkInfo:function checkInfo(path, Info, callback) {
        var connection = GetConnection();
        connection.connect();
        connection.query('select id as `id` from user where ' + path + '="' + Info + '"', function (error, results, fields) {

            if (typeof results[0] != "undefined") {
                callback && callback({ msg: true });

            } else {
                callback && callback({ msg: false });

            }
        })
        connection.end();
    },

    insertInfo:function insertInfo(table, url, callback) {
        var info = url.split(',');
        var connection = GetConnection();
        connection.connect();
        if (table == 'user') {
            connection.query('INSERT INTO user SET ?', { username: info[0], password: info[1], email: info[2], imageUrl: info[3] }, function (error, results, fields) {
                if (error) throw error;
                callback(results.insertId);
            })
        } else if (table == 'posts') {
            connection.query('INSERT INTO posts SET ?', { author: info[0], title: info[1], content: info[2], create_at: info[3] }, function (error, results, fields) {
                if (error) throw error;
                callback(results.insertId);
            })
        }
    },

    getImage:function getImage(username, callback) {
        var connection = GetConnection();
        connection.connect()
        connection.query('select imageUrl as `imageUrl` from user where username="' + username + '"', function (error, results, fields) {
            console.log(JSON.stringify(results[0].imageUrl))
            callback(JSON.stringify(results[0].imageUrl))
        })
        connection.end();
    },

    getAllPosts: function getAllPosts(callback){
        var connection = GetConnection();
        connection.connect();
        connection.query('select * from posts order by create_at desc',function(err,results,fields){
            callback(results);
        })
        connection.end();
    }
}