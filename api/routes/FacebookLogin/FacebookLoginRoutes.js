const _ = require('lodash');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const {User} = require('../../../model/User');


// Register new facebook strategy with passport
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL:process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'emails', 'name']
},
async function(accessToken, refreshToken, profile, cb) {
  try{
    // Check if user already exists- means this is not first login
    var user = await User.findOne({'facebook.id':profile.id});
    if(user) {
      return cb(null, user);
    }
    else{
      //this is first time login- create new user in application
      var newUser = new User();
      console.log(profile);
      console.log(accessToken);
      newUser.facebook.id    = profile.id;
      newUser.facebook.token = accessToken;
      newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
      newUser.facebook.email = profile.emails[0].value;
      var savedUser = await newUser.save();

      cb(null, savedUser);

    }
  }catch(e){
    console.log(e);
    cb(e);
  }

}));

/**
* Register all facebook login routes to the app provided
*
* @param {Express-app} app
*
*/

const facebookLoginRoute = (app) => {
  /**
  *GET api for facebook login
  *
  */
  app.get('/login/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // callback url provided to the facebook. It will be called if user is authenticated by facebook

  app.get('/login/facebook/callback',
  passport.authenticate('facebook'), async (req, res)=>{
    const token = await req.user.generateAuthToken();
    res.header('x-auth', token).send(req.user);
  });


}

module.exports = {
  facebookLoginRoute
};
