const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const User = require('../models/User.js');

passport.use(new GoogleStrategy({

  clientID        : process.env.CLIENT_ID,
  clientSecret    : process.env.CLIENT_SECRET,
  callbackURL     : process.env.GOOGLE_CALLBACK

},
(token, refreshToken, profile, done) => {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(() => {

        // try to find the user based on their google id
        User.findOne({ 'google.id' : profile.id }, (err, user) => {
          if (err)
            return done(err);

          if (user) {
                return done(null, user);
          } else {
            var newUser = new User();

            newUser.google.id    = profile.id;
            newUser.google.token = token;
            newUser.google.name  = profile.displayName;
            newUser.google.email = profile.emails[0].value; // pull the first email

            newUser.save((err) => {
              if (err) throw err;
              return done(null, newUser);
            });
          }
      });
  });
}));

passport.use(User.createStrategy());

require('./init.js')(User, passport);

module.exports = passport;
