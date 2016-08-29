(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('ProjectEditCtrl', ProjectEditCtrl);

  /* @ngInject */
  function ProjectEditCtrl($log, $state, $stateParams, ProjectsService) {
    var vm = this;

    vm.projectI = undefined;

    vm.modal = {
      org_name: '',
      org_info: '',
      org_roles: [{
        role_name: '',
        role_description: ''
      }]
    };

    vm.close = close;
    vm.done = done;
    vm.add = add;
    vm.remove = remove;

    //////////

    function close() {
      // $('#projectModal').off('hidden.bs.modal');
      if (vm.projectI >= 0) {
        $state.go('Landing.Projects.Manage');
      } else {
        $state.go('Landing.Projects');
      }
    }

    function done() {
      if (vm.projectI < 0) {
        ProjectsService.createProject(vm.modal);
        $state.go('Landing.Projects');        
      } else {
        ProjectsService.updateProject(vm.projectI, vm.modal);
        $state.go('Landing.Projects');        
      }
      close();
    }

    function add() {
      vm.modal.org_roles[vm.modal.org_roles.length] = {
        role_name: '',
        role_description: ''
      };
    }

    function remove(index) {
      vm.modal.org_roles.splice(index, 1);
    }

    function init() {
      vm.myProjects = ProjectsService.getAllProjects();
      vm.projectI = $stateParams.projectI;

      // populate UI
      if (vm.projectI >= 0) {
        vm.title = 'Edit Project';
        ProjectsService.readProject(vm.projectI).then(function(data) {
          vm.modal = angular.copy(data);
        });
      }
      else {
        vm.title = 'Add New Project';
      }

      // $('#projectModal').modal();
      // $('#projectModal').on('hidden.bs.modal', function(e) {
      //   vm.close();
      // });
    }

    init();
  }
})();
