const express = require('express');
const userHelpers = require('../helpers/userHelpers');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  let userName=req.session.userName
  res.render('user/home', {user:true,userName});
});

router.get('/login', (req, res) => {
  if(req.session.userLoggedIn){
    res.redirect('/')
  }else{
    res.render('user/userLogin', {emailErr:req.session.emailErr, passErr: req.session.passErr, user:true})
    req.session.emailErr = false;
    req.session.passErr = false;
  }
})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if(response.status === "Invalid Email"){
      req.session.emailErr = response.status;
      // req.session.passErr = response.passErr;
      res.redirect('/login')
    }else if(response.status === "Invalid Password"){
      req.session.passErr =  response.status;
      res.redirect('/login')
    }else if(response.status === "Invalid User"){
      req.session.emailErr = response.status;
      res.redirect('/login')
    }else{
      req.session.user =  response.user;
      req.session.userName =  req.session.user.name;
      req.session.userLoggedIn = true;
      res.redirect('/');
    }
    
    })
})

router.get('/signup', (req, res) => {
  res.render('user/signup', {user:true})
})

router.post('/signup', (req, res) => {
  userHelpers.doSignUp(req.body).then((response) => {
    res.redirect("/login")
  }).catch((err) => {
    console.log(err);
  })
});

router.get('/logout', (req, res) => {
  req.session.userLoggedIn= false;
  req.session.user =  false;
  req.session.userName =  req.session.user.name;
  res.redirect('/login')
})

module.exports = router;
