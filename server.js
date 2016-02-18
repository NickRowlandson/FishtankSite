(function() {
  var express = require('express'),
    app = express(),
    routes = require('./api/routes.js')(app);

  app.listen(8080, function() {
    console.log("API listening on port 8080");
  });
}());
