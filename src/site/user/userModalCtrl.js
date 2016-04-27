(function() {
  'use strict';

  angular
    .module('devPortal')
    .controller('UserModalCtrl', UserModalCtrl);

  /* @ngInject */
  function UserModalCtrl($state, $stateParams, ProjectUsersMgmService, AppService, ProjectModel) {
    var vm = this;

    vm.modal = {
      account_id: '',
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
    vm.userI = undefined;
    vm.isDisabled = false;

    vm.close = close;
    vm.done = done;

    //////////

    function close() {
      $('#UserModal').off('hidden.bs.modal');
      $state.go('Projects.Edit');
    }

    function updateUserRoles() {
      var orgId = AppService.getModelProjectOrgId();
      var userRoles = {
        user_roles: []
      };
      var rolesChecked = _.filter(vm.modal.roles, function(role) {
        return role.checked;
      });
      userRoles.user_roles =  _.map(rolesChecked, 'id');
      return ProjectUsersMgmService.updateUserRoles(orgId, vm.modal.account_id, userRoles);
    }

    function done() {
      if (vm.userI >= 0) {
        updateUserRoles().finally(function() {
          ProjectModel.listUsers();
        });
      }
    }

    function init() {
      vm.role = $stateParams.role;
      vm.userI = $stateParams.userI;

      if (vm.userI >= 0) {
        vm.isDisabled = true;
        var user = angular.copy(ProjectModel.get().users[vm.userI]);
        vm.modal.account_id = user.account_id;
        var relatedUsers = _.filter(ProjectModel.get().users, function(user) {
          return vm.modal.account_id === user.account_id;
        });
        var relatedRoles = _.map(relatedUsers, 'role');
        _.each(vm.modal.roles, function(role) {
          role.checked = relatedRoles.indexOf(role.id) > -1;
        });
      } else {
        vm.isDisabled = false;
      }

      $('#UserModal').modal();
      $('#UserModal').on('hidden.bs.modal', function(e) {
        vm.close();
      });
    }

    init();
  }
})();
