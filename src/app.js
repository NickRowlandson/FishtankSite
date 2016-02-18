(function() {
  //  INCLUDE NEW MODULES HERE
  angular.module('PlaygroundApp', [
      'ngRoute',
      'main',
      'navbar',
      'footer',
      'login',
      'user.service',
      'APIInterceptor.service',
      'LocalStorageModule',
      'environmentVariables'
    ])
    .config(Config);

  Config.$inject = ['$routeProvider', '$httpProvider', 'localStorageServiceProvider'];

  function Config($routeProvider, $httpProvider, localStorageServiceProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/components/main/main.template.html',
        controller: 'mainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/oops'
      });

    localStorageServiceProvider.setPrefix('playground.');
    $httpProvider.interceptors.push('APIInterceptor');
  };
}());
