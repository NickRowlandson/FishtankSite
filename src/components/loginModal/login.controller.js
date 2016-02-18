(function() {
  angular.module('login.controller', ['authentication.factory'])
    .controller('loginCtrl', MainLogin);

  MainLogin.$inject = ['authenticationFactory', '$rootScope'];

  function MainLogin(auth, $rootScope) {
    // Set scope.
    var login = this;
    function showRegistration() {
    	$rootScope.$emit('showRegistration');
    };
    login.login = function() {
      console.log(login.username, login.password, login.keepLoggedIn);
      auth.login(login.username, login.password, login.keepLoggedIn)
        .then(function(data) {
          console.log("SUCCESS");
          //redirect to main user page
          //Login successful alert status
        }, function(data) {
          console.log("FAILURE");
        });
    };
  }
}());
