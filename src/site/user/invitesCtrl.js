(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('InvitesCtrl', InvitesCtrl);

  /* @ngInject */
  function InvitesCtrl($state, $stateParams, ProjectsService, ProjectUsersMgmService) {
    var vm = this;
    vm.model = {
      invites: []
    };

    vm.launchModal = launchModal;
    vm.deleteInviteRole = deleteInviteRole;

    //////////

    function launchModal(inviteI, role) {
      $state.go("Projects.Edit.Invite", {
        'inviteI': inviteI,
        'role': role
      });
    }

    function deleteInviteRole(index) {
      ProjectsService.deleteInviteRole(index);
    }

    function init() {
      vm.model = ProjectsService.getModel();
    }

    init();
  }

})();
