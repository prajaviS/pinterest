var express = require('express');
var router = express.Router();
const usermodel=require("./users");
const postmodel=require("./post");
const passport = require('passport');
const localStrategy=require("passport-local");
passport.use(new localStrategy(usermodel.authenticate()));

const upload=require('./multer');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pinterest' });
});

router.get('/register', function(req, res,next) {
  res.render('register');
});
router.get('/home', function(req, res,next) {
  res.render('home');
});

router.get('/profile',isLoggedIn,async function(req,res,next){
  const user=
  await usermodel
        .findOne({username: req.session.passport.user})
        .populate("posts");
        console.log(user);
  res.render('profile',{user});
});
router.get('/show/posts',isLoggedIn,async function(req,res,next){
  const user=
  await usermodel
        .findOne({username: req.session.passport.user})
        .populate("posts");
        console.log(user);
  res.render('show',{user});
});

router.get('/feed',isLoggedIn,async function(req,res,next){
  const user=await usermodel.findOne({username: req.session.passport.user});
  const posts = await postmodel.find()
                .populate("user");
  
        
  res.render('feed',{user,posts});
});



router.get('/add',isLoggedIn ,async function(req, res,next) {
  const user=await usermodel.findOne({username: req.session.passport.user});
  res.render('add',{user});
});

//
router.post('/register',function(req,res){
  var userdata=new usermodel({
    username: req.body.username,
    name:req.body.name,
    email:req.body.email,
    dateOfBirth: new Date(req.body.dateOfBirth) 
  });
  usermodel.register(userdata,req.body.password)
  .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile')
    })
  })
});

//login
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/",
  
}),function(req,res){ 
});


//logout
router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
} 
//multer
router.post('/fileupload',isLoggedIn,upload.single('image'),async function(req,res,next){
  const user=await usermodel.findOne({username: req.session.passport.user});
  user.profileImage=req.file.filename;
  await user.save();
  res.redirect("/profile");

});
//createpost
router.post('/createpost',isLoggedIn,upload.single('postimage'),async function(req,res,next){
  const user=await usermodel.findOne({username: req.session.passport.user});
  const post = await postmodel.create({
    user:user._id,
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    board: req.body.board,
    tag: req.body.tag,
    image:req.file.filename
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile")
})

module.exports = router;