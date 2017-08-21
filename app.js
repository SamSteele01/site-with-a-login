const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mustache = require('mustache-express');
// const loginRouter = require('./routes/login');
const User = require('./users.js');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

app.engine('mustache', mustache());
app.set('views', ['./views', './views/login']);
app.set('view engine', 'mustache');

// app.use('/',loginRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.get('/', function(req,res){
  res.render('login');
})

app.post('/login', function(req,res){
  req.assert("username", "You must enter a username!").notEmpty();
  req.assert("password", "You must enter a password!").notEmpty();
  req.getValidationResult().then(function(result) {
  // do something with the validation result
    var errors = result;
    res.render('login', {errors: errors});
  });
  var username = req.body.username;
  var password = req.body.password;
  authenticate(req, username, password);
  if (req.session && req.session.authenticated){
    res.render('index', { username: username });
  } else {
    // var errors =
    res.render('login');
}});

function authenticate(req, username, password){
  var authUser = User.userList.find(function (user) {
    if (username === user.username && password === user.password) {
      req.session.authenticated = true;
      console.log('User & Password Authenticated');
    } else {
      return false
    }
  });
  console.log(req.session);
  return req.session;
};

// app.get('/', function(req, res) {
//   // redirect to login if not already logged in
//   // var user = User.find()
//   // res.send(user);
//   res.render('index')
// })

// app.get('/login', function(req,res){
//   res.render('login');
// })

app.listen(port, function() {
  console.log('Example listening on port 3000')
})
