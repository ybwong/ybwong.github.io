(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('ProjectModalCtrl', ProjectModalCtrl);

  /* @ngInject */
  function ProjectModalCtrl($log, $state, $stateParams, IfStudioClient, ProjectsService) {
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
      $('#projectModal').off('hidden.bs.modal');
      if (vm.projectI >= 0) {
        $state.go('Projects.Edit');
      } else {
        $state.go('Projects');
      }
    }

    function done() {
      if (vm.projectI < 0) {
        IfStudioClient.registerProject(vm.modal, function(data) {
          $log.log("Created new project", data);
          $state.go('Projects');
        }, function(error) {
          $log.log("Failed to create project", error);
        });
      } else {
        var orgId = vm.myProjects[vm.projectI].org_id;
        IfStudioClient.updateProject(orgId, vm.modal, function(data) {
          $log.log("updated project", data);
        }, function(error) {
          $log.log("Failed to update project", error);
        });
      }
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
        var orgId = vm.myProjects[vm.projectI].org_id;
        IfStudioClient.getProjectDetails(orgId, function(data) {
          vm.modal = data;
        });
      }

      $('#projectModal').modal();
      $('#projectModal').on('hidden.bs.modal', function(e) {
        vm.close();
      });
    }

    init();
  }
})();
