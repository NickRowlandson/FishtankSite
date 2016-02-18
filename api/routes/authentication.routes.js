(function() {
  module.exports = function(app, mongoose) {
    app.post('/login', function(req, res) {
      console.log("YOU ARE NOW LOGGED IN. Nope, just kidding.");
      //Take the user name and password of the user.
      //Look up the username and password in the database
      //If exists. Return a json web token
      //Otherwise, Return 403
      res.sendStatus(403);
    });
  };
}());
