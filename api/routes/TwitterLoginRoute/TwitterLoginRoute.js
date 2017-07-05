const TwitterStrategy  = require('passport-twitter').Strategy;
const _ = require('lodash');
const passport = require('passport');

const {User} = require('../../../model/User');

passport.use(new TwitterStrategy({

  consumerKey     : process.env.TWITTER_CONSUMER_KEY,
  consumerSecret  : process.env.TWITTER_CONSUMER_SECRET,
  callbackURL     : process.env.TWITTER_CALLBACK_URL

},
async function(accessToken, tokenSecret, profile, cb) {

  try{
    var twitterUser = await User.findOne({ 'twitter.id' : profile.id });

    if(twitterUser){

      return cb(null, twitterUser);
    }
    var newTwitterUser  = new User();
    newTwitterUser.twitter.id          = profile.id;
    newTwitterUser.twitter.token       = accessToken;
    newTwitterUser.twitter.username    = profile.username;
    newTwitterUser.twitter.displayName = profile.displayName;

    var savedUser = await newTwitterUser.save();
    cb(null, savedUser);
  }catch(e){
    console.log(e);
    cb(e);
  }

}));

const twitterLoginRoute = (app) => {
  app.get('/login/twitter', passport.authenticate('twitter'));

  // handle the callback after twitter has authenticated the user
  app.get('/login/twitter/callback',
  passport.authenticate('twitter'),async (req, res)=>{
    const token = await req.user.generateAuthToken();
    res.header('x-auth', token).send(req.user);
  });
}


module.exports = {
  twitterLoginRoute
}
