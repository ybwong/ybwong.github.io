(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('InvitesCtrl', InvitesCtrl);

  /* @ngInject */
  function InvitesCtrl($state, ProjectsService, ProjectUsersMgmService) {
    var vm = this;
    vm.model = {
      invites: []
    };
    vm.isEditDisabled = true;
    vm.isDeleteDisabled = true;
    vm.isInviteSelected = [];
    vm.selectedInvites = [];

    vm.toggleInvite = toggleInvite;
    vm.launchModal = launchModal;
    vm.deleteInviteRole = deleteInviteRole;

    //////////

    function toggleInvite(index, role) {
      if (vm.isInviteSelected[index]) {
        vm.isInviteSelected[index] = undefined;
        _.pull(vm.selectedInvites, index);
      } else {
        vm.isInviteSelected = [];
        vm.selectedInvites = [];

        vm.isInviteSelected[index] = true;
        vm.selectedInvites.push(index);
      }

      if (vm.selectedInvites.length > 1) {
        vm.isEditDisabled = true;
        vm.isDeleteDisabled = false;
      } else if (vm.selectedInvites.length === 1) {
        vm.isEditDisabled = false;
        vm.isDeleteDisabled = false;
      } else {
        vm.isEditDisabled = true;
        vm.isDeleteDisabled = true;
      }
    }

    function launchModal(inviteI, role) {
      if (inviteI !== -1) {
        inviteI = vm.selectedInvites[0];
      }
      $state.go("Landing.Projects.Manage.EditInvite", {
        'inviteI': inviteI,
        'role': role
      });
    }

    function deleteInviteRole() {
      var index = vm.selectedInvites[0];
      ProjectsService.deleteInviteRole(index);
    }

    function init() {
      vm.model = ProjectsService.getModel();
    }

    init();
  }

})();
