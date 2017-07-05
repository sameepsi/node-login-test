const mongoose=require('mongoose');
const validator=require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({

  local            : {
    email        :{
      type:String,
      trim: true,
      minlength:1,

      validate: {
        validator:(value) => {
          return validator.isEmail(value);
        },
        message:'{VALUE} is not a valid email'
      }
    },
    password     : {
      type:String,
      minlength: 6
    },
  },
  facebook         : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  },
  twitter:{
    id:String,
    token:String,
    displayName:String,
    username:String
  },
  tokens: [{
    access:{
      type:String,
      required: true
    },
    token:{
      type: String,
      required:true
    }
  }]
});


UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'local.email', 'facebook.email', 'facebook.name', 'twitter.displayName', 'twitter.username']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET,   {

    'expiresIn': '60 days'
  }).toString();

  user.tokens.push({access,token});
  return user.save().then((user) => {
    return token;

  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull :{
      tokens:{
        token: token
      }
    }
  });
};


UserSchema.statics.findByLocalUser = function (email, password) {
  var User = this;

  return User.findOne({'local.email':email}).then((user) => {
    
    if(!user ){
      return  Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.local.password, (err, res) => {
        if(res){
          resolve(user);
        }
        reject();
      });
    });
  });
};



UserSchema.methods.genHashedPassowrd = async function(password){
  try{

    var salt = await bcrypt.genSalt(10);
    var hash = await   bcrypt.hash(password, salt);
    return hash;
  }catch(e){
    throw new Error(e);
  }

}
var User= mongoose.model('User',UserSchema);


module.exports={User};
