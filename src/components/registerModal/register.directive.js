(function() {
  angular.module('register.directive', ['register.controller'])
    .directive('register', function() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/registerModal/register.template.html',
        controller: 'registerCtrl',
        controllerAs: 'register'
      };
    });
}());
