// not going to use yet
const express = require('express');
const router = express.Router()

router.use(function(req, res, next) {
  console.log("Middleware to authenticate login");
  next();
})

router.get('/', function(req, res){
  console.log('index for login')

  res.render('index');
})
//
// router.get('/login', function(req,res){
//   console.log('')
// })

router.get('/login', function(req, res){
  res.render('login');
})

router.post('/login', function(req,res){
  req.checkBody("user", "You must enter a username!").notEmpty();
  req.session.
})

// module.exports = router;
