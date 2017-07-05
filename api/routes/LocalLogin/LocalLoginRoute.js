const _ = require('lodash');

const {User} = require('../../../model/User');

/**
* Register all local login routes to the app provided
*
* @param {Express-app} app
*
*/

const localLoginRoute = (app) => {


  /**
  *POST api to create new user
  *@apiParam{String} email
  *@apiParam{String} password
  *
  *@return {Object} user and jwt token as header 'x-auth'
  */
  app.post('/users', async(req, res) => {
    try{

      var body = _.pick(req.body, ['email','password']);

      var user=new User();

      //Before creating new user we can also check if user exists with same emailid. Currently I have not performed that check.

      user.local.email = body.email;
      user.local.password = await user.genHashedPassowrd(body.password);

      await user.save();
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    }catch(e){
      res.status(400).send(e);
    }
  });


  /**
  *POST api to login
  *@apiParam{String} email
  *@apiParam{String} password
  *
  *@return {Object} user and jwt token as header 'x-auth'
  */
  app.post('/users/login', async (req, res) => {

    try{
      const body = _.pick(req.body, ['email', 'password']);
      const user = await User.findByLocalUser(body.email, body.password);
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);
    }catch(e){
      console.log(e);
      res.status(400).send();
    }


  });
}

module.exports = {
  localLoginRoute
}
