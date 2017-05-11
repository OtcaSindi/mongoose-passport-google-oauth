const router = require('express').Router();
const passport = require('../auth/google.js');
const User = require('../models/User.js');


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
} 

router.get('/', (req,res) => {
  res.render('index', { user: req.user });
});

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile',
  {
    user : req.user
  });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  User.register(new User({ username : req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.render('register', { user });
    }
    passport.authenticate('local')(req, res, ()=> {
      res.redirect('/');
    });
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

router.get('/auth/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
  );

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/fail'
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;