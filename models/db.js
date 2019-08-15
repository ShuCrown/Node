var Sequelize = require('sequelize')
var sequelize = new Sequelize('mysql://root:12345678@localhost:3306/nodejs');


var Post = sequelize.define('posts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    author: Sequelize.STRING,
    title: Sequelize.STRING,
    content: Sequelize.STRING,
    pv: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    create_at:Sequelize.DATE
})
module.exports.Post = Post;