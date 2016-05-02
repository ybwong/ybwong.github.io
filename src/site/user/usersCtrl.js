(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('UsersCtrl', UsersCtrl);

  /* @ngInject */
  function UsersCtrl($state, $stateParams, ProjectsService, ProjectUsersMgmService) {
    var vm = this;

    vm.launchModal = launchModal;

    //////////

    function launchModal(userI, role) {
      $state.go("Projects.Edit.User", {
        'userI': userI,
        'role': role
      });
    }

    function init() {
      vm.projectModel = ProjectsService.getModel();
    }

    init();
  }

})();
