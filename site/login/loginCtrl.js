(function() {
  angular
    .module('devPortal')
    .controller('LoginCtrl', LoginCtrl);
  /* @ngInject */
  function LoginCtrl($state, $log, IfProjects, IdpClient) {

    function init() {
      if (IdpClient.isAuthenticated()) {
        IdpClient.idpLogout();
        var isOperator = IdpClient.isAuthorized('OPERATION', IdpClient.idotProjectId);
        $state.transitionTo('GoHome');
      } else {
        $log.log("current state is", $state.current.name);
        IdpClient.idpLogin(function() {
          IfProjects.loadAllProjects(function() {
            $log.log('all projects loaded');
          });
        });
      }
    }

    init();
  }
})();
