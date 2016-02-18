(function() {
    var authentication = require('./routes/authentication.routes.js'),
    models = require('./models.js');
  module.exports = function(app) {

    //Base Routes
    app.get('/', function(req, res) {
      res.send("Welcome to the FyreSpark Financial API!");
    });

    //Specific Routes
    authentication(app, models.User);

  };
}());
