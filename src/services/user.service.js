(function() {

  angular
    .module('user.service', [])
    .service('UserService', UserService);

  UserService.$inject = ['localStorageService', '$location'];

  //This is the inlet for accessing user information throughout the application
  function UserService(store, $location) {
    var service = this;

    if (store.get('user') === undefined) {
      store.set('user', {});
    }

    service.setCurrentUser = function(user) {
      store.set('user', user);
      return user;
    };

    service.getCurrentUser = function() {
      var currentUser = store.get('user');
      return currentUser;
    };

    service.clearAll = function() {
      store.clearAll();
      $location.path('/');
    };

    service.setNewAccessToken = function(token) {
      if (service.getCurrentUser() != null) {
        store.get('user').access_token = token;
      }
    };
  }

}());
