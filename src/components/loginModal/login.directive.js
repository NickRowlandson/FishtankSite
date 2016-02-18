(function() {
  angular.module('login.directive', ['login.controller'])
    .directive('login', function() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/loginModal/login.template.html',
        controller: 'loginCtrl',
        controllerAs: 'login'
      };
    });
}());
