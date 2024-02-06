const mongoose = require('mongoose');
//const { use } = require('passport');
const plm=require('passport-local-mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/pinterest");

const userSchema=mongoose.Schema({
  username: String,
  name:String,
  email:String,
  password:String,
  dateOfBirth: { type: Date},
  profileImage: String,
  posts:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"post"
  }]
});
userSchema.plugin(plm);
module.exports=mongoose.model("user",userSchema);