(function() {
  angular.module('footer.directive', ['footer.controller'])
    .directive('footer', function() {
      return {
        restrict: 'E',
        templateUrl: 'app/components/footer/footer.template.html',
        controller: 'footerCtrl',
        controllerAs: 'foot'
      };
    });
}());
