(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('UsersCtrl', UsersCtrl);

  /* @ngInject */
  function UsersCtrl($state, $stateParams, ProjectsService, ProjectUsersMgmService) {
    var vm = this;
    vm.isEditDisabled = true;
    vm.isDeleteDisabled = true;
    vm.isUserSelected = [];
    vm.selectedUsers = [];

    vm.toggleUser = toggleUser;
    vm.launchModal = launchModal;
    vm.deleteUserRole = deleteUserRole;

    //////////

    function toggleUser(index, role) {
      if (vm.isUserSelected[index]) {
        vm.isUserSelected[index] = undefined;
        _.pull(vm.selectedUsers, index);
      } else {
        vm.isUserSelected = [];
        vm.selectedUsers = [];

        vm.isUserSelected[index] = true;
        vm.selectedUsers.push(index);
      }

      if (vm.selectedUsers.length > 1) {
        vm.isEditDisabled = true;
        vm.isDeleteDisabled = false;
      } else if (vm.selectedUsers.length === 1) {
        vm.isEditDisabled = false;
        vm.isDeleteDisabled = false;
      } else {
        vm.isEditDisabled = true;
        vm.isDeleteDisabled = true;
      }
    }

    function launchModal(userI, role) {
      if (userI !== -1) {
        userI = vm.selectedUsers[0];
      }
      $state.go("Landing.Projects.Manage.EditUser", {
        'userI': userI,
        'role': role
      });
    }

    function deleteUserRole() {
      var index = vm.selectedUsers[0];
      ProjectsService.deleteUserRole(index);
    }

    function init() {
      vm.projectModel = ProjectsService.getModel();
    }

    init();
  }

})();
