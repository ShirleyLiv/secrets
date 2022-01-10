//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password:String
});

userSchema.plugin(encrypt,{ secret: process.env.MYKEY, encryptedFields: ['password'] });
const User = mongoose.model('User', userSchema);

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
    extended:true
}));

app.get("/", function(req,res){
    res.render('home');
});

app.get("/login", function(req,res){
    res.render('login');
});

app.get("/register", function(req,res){
    res.render('register');
});

app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password:req.body.password

    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render('secrets');
        }
    });
});

app.post("/login",function(req,res){
    const oldEmail = req.body.username;
    const oldPassword = req.body.password;

    User.findOne({email:oldEmail}, function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === oldPassword){
                    res.render('secrets');
                }
            }
        }
    })
});




app.listen(3000,function(){
    console.log("the server is running on port 3000!")
});