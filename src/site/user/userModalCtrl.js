(function() {
  'use strict';

  angular
    .module('devPortal')
    .controller('UserModalCtrl', UserModalCtrl);

  /* @ngInject */
  function UserModalCtrl($state, $stateParams, ProjectUsersMgmService, AppService, ProjectsService) {
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
      var orgId = ProjectsService.getCurrProjectOrgId();
      var user = {
        user_roles: [],
        account_id: vm.modal.account_id,
        username: vm.modal.username
      };
      var rolesChecked = _.filter(vm.modal.roles, function(role) {
        return role.checked;
      });
      user.user_roles = _.map(rolesChecked, 'id');
      return ProjectsService.updateUserRoles(orgId, user);
    }

    function done() {
      if (vm.userI >= 0) {
        updateUserRoles().finally(function() {
          ProjectsService.listUsers();
        });
      }
    }

    function init() {
      vm.role = $stateParams.role;
      vm.userI = $stateParams.userI;

      vm.modal.roles = _.map(ProjectsService.getRoles(), function(role) {
        return { 'checked': false, 'id': role };
      });

      if (vm.userI >= 0) {
        vm.isDisabled = true;
        var user = angular.copy(ProjectsService.getModel().users[vm.userI]);
        vm.modal.account_id = user.account_id;
        vm.modal.username = user.username;
        vm.modal.first_name = user.first_name;
        vm.modal.last_name = user.last_name;        

        var relatedUsers = _.filter(ProjectsService.getModel().users, function(user) {
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
