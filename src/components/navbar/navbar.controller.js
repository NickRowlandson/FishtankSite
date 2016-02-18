(function() {
  angular.module('navbar.controller', [])
    .controller('navbarCtrl', MainNav);

  MainNav.$inject = ['$rootScope'];

  function MainNav($rootScope) {
    // Set scope.
    var nav = this;
    $rootScope.$on('showRegistration', function() {
  	});
  }
}());
