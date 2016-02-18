(function() {
  angular.module('register.controller', [])
    .controller('registerCtrl', MainRegister);

  MainRegister.$inject = [];

  function MainRegister() {
    // Set scope.
    var register = this;
    var showModal = false;
  }
}());
