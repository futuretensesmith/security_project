//jshint esversion:6

//required modules installed from CL
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

// new app instant using express
const app = express();

//sets view enigne to use ejs
app.set('view engine', 'ejs');

//use bodyParser to parse request
app.use(bodyParser.urlencoded({
  extended: true
}));

//use public directory to store static files like images, css etc.
app.use(express.static("public"));

//*******connects to mongoDB at local port 
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

//*************  sets model and schema. this is an object created from the mongoose schema class email
// and password are the fields ***/
const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

//****************** must add encrypt plugin to userSchema before you create User const with mongoose model */
//applied option of encryptedFields to only encrypt the password so that it's easier to find email in DB
//const secret = "Thisourlittlesecret." is the encryption key
const secret = "Thisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          console.log(password)
          res.render("secrets");
        }
      }
    }

  });
});



app.listen(3000, function() {
    console.log("Server started on port 3000.")
});
