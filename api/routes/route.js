
/**
 * Module dependencies.
 */
const {facebookLoginRoute} = require('./FacebookLogin/FacebookLoginRoutes');
const {twitterLoginRoute} = require('./TwitterLoginRoute/TwitterLoginRoute');
const {localLoginRoute} = require('./LocalLogin/LocalLoginRoute');

/**
 * Register all application routes(web apis) to the app provided
 *
 * @param {Express-app} app
 *@public
 */
const routes = (app) =>{
  facebookLoginRoute(app);
  twitterLoginRoute(app);
  localLoginRoute(app);
};


/**
 * Expose emailRoutes().
 */
module.exports = {
  routes
} ;
