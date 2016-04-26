(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('InvitesCtrl', InvitesCtrl);

  /* @ngInject */
  function InvitesCtrl($state, $stateParams, ProjectsService, ProjectUsersMgmService, ProjectModel) {
    var vm = this;
    vm.adminRoleInvites = [];
    vm.userRoleInvites = [];
    vm.invites = [];
    vm.projectId = undefined;

    vm.launchModal = launchModal;
    vm.deleteInviteRole = deleteInviteRole;

    //////////

    function launchModal(inviteI, role) {
      $state.go("ProjectsManage.Invite", {
        'inviteI': inviteI,
        'role': role
      });
    }

    function deleteInviteRole(index) {
      var inviteI = ProjectModel.get().invites[index];

      var invite = {
        'id_key': inviteI.id_key,
        'id_type': inviteI.id_type,
        'user_roles': [inviteI.role]
      };

      var invites = [invite];

      return ProjectUsersMgmService.deleteInviteRole(vm.projectId, invites).then(function() {
        ProjectModel.get().invites.splice(index, 1);
      });
    }

    function init() {
      var myProjects = ProjectsService.getAllProjects();
      var projectIndex = $stateParams.projectIndex;
      vm.projectId = myProjects[projectIndex].org_id;

      vm.projectModel = ProjectModel.get();
      ProjectModel.setProjectId(vm.projectId);
      ProjectModel.listInvites();
    }

    init();
  }

})();
