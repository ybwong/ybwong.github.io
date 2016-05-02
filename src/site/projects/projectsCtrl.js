(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('ProjectsCtrl', ProjectsCtrl);

  /* @ngInject */
  function ProjectsCtrl($state, $log, ProjectsService) {
    var vm = this;

    vm.myProjects = {};

    vm.removeProject = removeProject;
    vm.loadAllProjects = loadAllProjects;
    vm.launchModal = launchModal;

    //////////

    function removeProject(index) {
      $log.log("removing project", vm.myProjects[index].org_id);
      ProjectsService.deleteProject(index).then(function(data) {
        $log.log("removed project", data);
        vm.myProjects.splice(index, 1);
      }, function(error) {
        $log.log("Failed to removed project", error);
      });
    }

    function loadAllProjects() {
      vm.myProjects = [];
      ProjectsService.loadAllProjects().then(function(data) {
        vm.myProjects = data;
      });
    }

    function launchModal(projectI) {
      if (projectI >= 0) {
        var orgId = vm.myProjects[projectI].org_id;
        ProjectsService.setCurrProjectOrgId(orgId);
      }

      $state.go("Projects.Modal", {
        'projectI': projectI
      });
    }

    function init() {
      vm.loadAllProjects();
    }

    init();
  }
})();
