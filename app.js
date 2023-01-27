require('dotenv').config();

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/userDB')

console.log(process.env.SECRET)

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
  

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    const newUser = new User({email: req.body.username, password:req.body.password});

    newUser.save(function (err) {
        if(!err) {
            res.render('secrets');
        } else {
            console.log(err);
        }
    });
});


app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function (err, foundedUser) {
        if(err) {
            console.log(err);
        } else {
            if(foundedUser) {
                if(foundedUser.password === password) {
                    res.render('secrets');
                } else {
                    console.log('email or password not correct!');
                }
            } else {
                console.log('no such username or password');
            }
        }
    });
});


app.listen(3000, function () {
    console.log('Server is running on port 3000 ...');
});
