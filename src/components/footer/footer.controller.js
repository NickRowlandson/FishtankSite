(function() {
  angular.module('footer.controller', [])
    .controller('footerCtrl', MainFoot);

  MainFoot.$inject = [];

  function MainFoot() {
    // Set scope.
    var foot = this;
  }
}());
