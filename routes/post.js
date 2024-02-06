const mongoose = require('mongoose');
const postSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title:String,
    description:String,
    link:String,
    board:String,
    tag:String,
    image:String

});
module.exports=mongoose.model("post",postSchema);