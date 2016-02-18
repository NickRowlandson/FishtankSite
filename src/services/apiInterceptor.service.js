(function() {

  angular
    .module('APIInterceptor.service', [])
    .service('APIInterceptor', APIInterceptor);

  APIInterceptor.$inject = ['UserService', '$q'];

  //This service, inserts the access_token into each request.
  function APIInterceptor(UserService, $q) {
    var service = this;

    service.request = function(config) {
      var currentUser = UserService.getCurrentUser(),
        access_token = currentUser ? currentUser.access_token : null;

      if (access_token) {
        config.headers.authorization = access_token;
      }
      return config || $q.when(config);
    };

    service.responseError = function(response) {
      return response || $q.when(response);
    }
  }

  var x
}());
