(function() {
  angular.module('authentication.factory', [])
    .factory('authenticationFactory', AuthenticationService);

  AuthenticationService.$inject = ['$http', '$q', 'API_URL', 'UserService'];

  function AuthenticationService($http, $q, url, userService) {
    var auth = { "login": login };
    return auth;

    function login(username, password) {
      var def = $q.defer();

      $http.post(url + "/login", {
        "username": username,
        "password": password
      }).
      success(function(data) {
        if (data.token != undefined) {
          var token = data.token;
          //Store the token for API calls HERE
          UserService.setCurrentUser({
            'access_token': token,
            'username': username,
            'admin': data.isAdmin
          });

          def.resolve(data);
        } else {
          def.reject(data);
        }
      }).error(function(data) {
        def.reject(data);
      });

      return def.promise;
    };
  };
}());
