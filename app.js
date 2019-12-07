require('dotenv').config()
const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const ejs=require('ejs');

var encrypt = require('mongoose-encryption');

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",{ useUnifiedTopology: true, useNewUrlParser: true});
const Schema=mongoose.Schema;
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ["password"]});

const User = mongoose.model('User', userSchema);
app.get("/",function(req,res)
{
  res.render("home");
});
app.get("/login",function(req,res)
{
  res.render("login");
});
app.post("/login",function(req,res){
  const userName=req.body.username;
  const pass=req.body.password;

  User.findOne({email:userName},function(err,foundList)
{
    if(err)
    {
      console.log(err);
    }
    else{
      if(foundList)
      {
        if(foundList.password===pass){
          res.render("secrets");
        }
      }
      else{
        console.log("Username or password is wrong");
      }
    }
});
});


app.get("/register",function(req,res)
{
  res.render("register");
});
app.post("/register",function(req,res){
  const user=new User({
    email:req.body.username,
    password:req.body.password
  });
  user.save(function(err)
{
  if(err){
    console.log(err);
  }
  else{
    res.render("secrets");
  }
});
});




app.listen(3000,function(){
  console.log("Server sarted on port 3000");
});
