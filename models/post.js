const Post = require('./db').Post;
module.exports = {
    getPostById:function getPostById(postId){
        return Post.findById(
            postId,{attributes:['id','title','content','author','pv','create_at']}   
        )
    }
}