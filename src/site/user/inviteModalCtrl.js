(function() {
  'use strict';

  angular
    .module('devPortal')
    .controller('InviteModalCtrl', InviteModalCtrl);

  /* @ngInject */
  function InviteModalCtrl($state, $stateParams, ProjectUsersMgmService, AppService, ProjectModel) {
    var vm = this;

    vm.modal = {
      id_key: '',
      id_type: 'email',
      roles: [{
        checked: false,
        id: 'USER'
      }, {
        checked: false,
        id: 'ADMIN'
      }]
    };

    vm.role = undefined;
    vm.inviteI = undefined;
    vm.isDisabled = false;

    vm.close = close;
    vm.done = done;

    //////////

    function close() {
      $('#InviteModal').off('hidden.bs.modal');
      $state.go('ProjectsManage');
    }

    function addRoles() {
      var orgId = AppService.getModelProjectOrgId();
      var invite = {
        id_key: vm.modal.id_key,
        id_type: vm.modal.id_type,
        user_roles: []
      };

      var rolesChecked = _.filter(vm.modal.roles, function(role) {
        return role.checked;
      });
      invite.user_roles = _.map(rolesChecked, 'id');
      var invites = [invite];
      return ProjectUsersMgmService.addInvites(orgId, invites);
    }

    function delRoles() {
      var orgId = AppService.getModelProjectOrgId();
      var invite = {
        id_key: vm.modal.id_key,
        id_type: vm.modal.id_type,
        user_roles: []
      };

      var rolesUnchecked = _.filter(vm.modal.roles, function(role) {
        return !role.checked;
      });
      invite.user_roles = _.map(rolesUnchecked, 'id');
      var invites = [invite];
      return ProjectUsersMgmService.deleteInviteRole(orgId, invites);
    }

    function done() {

      if (vm.inviteI >= 0) {
        addRoles().finally(delRoles).finally(function() {
          ProjectModel.listInvites();
        });
      } else {
        addRoles().finally(function() {
          ProjectModel.listInvites();
        });
      }
    }

    function init() {
      vm.role = $stateParams.role;
      vm.inviteI = $stateParams.inviteI;

      if (vm.inviteI >= 0) {
        vm.isDisabled = true;        
        var invite = angular.copy(ProjectModel.get().invites[vm.inviteI]);
        vm.modal.id_key = invite.id_key;
        vm.modal.id_type = invite.id_type;
        var relatedInvites = _.filter(ProjectModel.get().invites, function(invite) {
          return vm.modal.id_key === invite.id_key;
        });
        var relatedRoles = _.map(relatedInvites, 'role');
        _.each(vm.modal.roles, function(role) {
          role.checked = relatedRoles.indexOf(role.id) > -1;
        });
      }
      else {
        vm.isDisabled = false;
      }

      $('#InviteModal').modal();
      $('#InviteModal').on('hidden.bs.modal', function(e) {
        vm.close();
      });
    }

    init();
  }
})();
