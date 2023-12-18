//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://0.0.0.0:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
      email: String,
      password: String
});

userSchema.plugin(encrypt, {secret:process.env.SECRET,encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.post("/register", function(req, res){
      console.log(req.body);
      const newUser = new User({
          email: req.body.username,
          password: req.body.password
      });
  
      newUser.save().then(()=>{
          res.render("login");
      }).catch((err)=>{
          console.log(err);
      })
  });


app.post("/login",async function(req, res){
      const username =  req.body.username;
      const password = req.body.password;

      try{  
            let foundUser = await User.findOne({email: username});
            console.log(foundUser);
            if (foundUser) {
                  if (foundUser.password === password) {
                        res.render("secrets");
                  }
            }

      }catch(err){
            console.log(err);
      }
});

app.get("/", function (req, res) {
      res.render("home.ejs");
});

app.get("/login", function (req, res) {
      res.render("login.ejs");
});

app.get("/register", function (req, res) {
      res.render("register.ejs");
});

app.listen(3000, function () {
      console.log("Example app listening on port 3000!");
});
