const express = require('express');
const mustache = require('mustache-express');
const session = require('express-session');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const parseurl = require('parseurl')
const path = require('path');
const app = express();
const port = 3000;
const User = require('./users.js');

app.engine('mustache', mustache());
app.set('views', ['./views', './views/login', './views/signup']);
app.set('view engine', 'mustache');

// app.use('/',loginRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  // cookie: { secure: true }
}))

app.use(function (req, res, next) {
  var views = req.session.views
  if (!views) {
    views = req.session.views = {}
  }
  // get the url pathname
  var pathname = parseurl(req).pathname
  // count the views
  views[pathname] = (views[pathname] || 0) + 1
  next()
})

var errors = [];
var authErrors = "";
var emptyErrors = "";
var eErrors = "";

app.get('/', function(req,res){
  //   // redirect to login if not already logged in
  res.render('login', {error: errors});
})

app.get('/index', function(req, res) {
//   // redirect to login if not already logged in
  if(req.session.authenticated){
    res.render('index', { username: req.session.username, token: req.session.cookie, views: req.session.views['/index']});
  }else{
  res.redirect('/login')
  }
})

app.get('/login', function(req,res){
  res.render('login', {error: errors});
})

app.post('/login', function(req,res){
  errors = [];
  var username = req.body.username;
  var password = req.body.password;
  if(username===""){
    errors.push("You must enter a username.")
  }
  if(password===""){
    errors.push("You must enter a password.")
  }
  if(username!=""&&password!=""){
    authenticate(req, username, password);
    if (req.session && req.session.authenticated){
      req.session.username = username;
      res.redirect('/index');
    } else {
      errors.push("Unable to authenticate user.");
      res.redirect('/');
    }
  }
  else{res.redirect('/')};
});

function authenticate(req, username, password){
  var authUser = User.userList.find(function (user) {
    if (username === user.username && password === user.password) {
      req.session.authenticated = true;

      console.log('User & Password Authenticated');
    } else {
      // errors.push("Could not authenticate. ");
      return authErrors
    }
  });
  console.log(req.session);
  return req.session;
};

// not needed
function checkEmpty(req, username, password){
  req.checkBody("username", "You must enter a username!").notEmpty();
  req.getValidationResult().then(function(result) {
    console.log(req.xhr);
    // do something with the validation result
    emptyErrors = result.mapped();
    console.log(emptyErrors);
    console.log(" line 78");
    if(emptyErrors != {}){
      console.log(emptyErrors.username.msg+" line 80");
      // return res.render('/', {errors: errors});
      eErrors = emptyErrors.username.msg;
      emptyErrors = {};
    }
    return eErrors;
      // next();
  });
  req.checkBody("password", "You must enter a password!").notEmpty();
  req.getValidationResult().then(function(result) {
    console.log(result);
    emptyErrors = result.mapped();
    console.log(emptyErrors);
    console.log(" line 92");
    if(emptyErrors != {}){
      console.log(emptyErrors.password.msg+" line 94");
      // return res.render('/', {errors: errors});
      eErrors = emptyErrors.password.msg;
      emptyErrors = {};
    }
    return eErrors;
})};

app.listen(port, function() {
  console.log('Example listening on port 3000')
})
