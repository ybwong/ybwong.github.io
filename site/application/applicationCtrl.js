(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('ApplicationCtrl', ApplicationCtrl);

  /* @ngInject */
  function ApplicationCtrl($state, ProjectsService) {
    var vm = this;
    vm.model = {
      appList: []
    };
    vm.isEditDisabled = true;
    vm.isDeleteDisabled = true;
    vm.isApplicationSelected = [];
    vm.selectedApplications = [];

    vm.toggleApplication = toggleApplication;
    vm.launchApplicationModal = launchApplicationModal;
    vm.removeApp = removeApp;

    //////////

    function toggleApplication(index) {
      if (vm.isApplicationSelected[index]) {
        vm.isApplicationSelected[index] = undefined;
        _.pull(vm.selectedApplications, index);
      } else {
        vm.isApplicationSelected = [];
        vm.selectedApplications = [];

        vm.isApplicationSelected[index] = true;
        vm.selectedApplications.push(index);
      }

      if (vm.selectedApplications.length > 1) {
        vm.isEditDisabled = true;
        vm.isDeleteDisabled = false;
      } else if (vm.selectedApplications.length === 1) {
        vm.isEditDisabled = false;
        vm.isDeleteDisabled = false;
      } else {
        vm.isEditDisabled = true;
        vm.isDeleteDisabled = true;
      }
    }

    function launchApplicationModal(appIndex) {
      if (appIndex !== -1) {
        appIndex = vm.selectedApplications[0];
      }
      $state.go("Landing.Projects.Manage.EditApplication", {
        'appIndex': appIndex 
      });
    }

    function removeApp() {
      var appIndex = vm.selectedApplications[0];
      ProjectsService.deleteApplication(appIndex);
    }

    function init() {
      vm.model = ProjectsService.getModel();
    }

    init();
  }

})();
