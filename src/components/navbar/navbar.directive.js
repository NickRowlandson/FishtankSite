(function() {
  angular.module('navbar.directive', ['navbar.controller'])
    .directive('navbar', function() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/navbar/navbar.template.html',
        controller: 'navbarCtrl',
        controllerAs: 'nav'
      };
    });
}());
