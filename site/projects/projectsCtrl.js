(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('ProjectsCtrl', ProjectsCtrl);

  /* @ngInject */
  function ProjectsCtrl($state, $log, ProjectsService) {
    var vm = this;

    vm.myProjects = {};
    vm.formClass = '';
    vm.isEditDisabled = true;
    vm.isDeleteDisabled = true;
    vm.isProjectSelected = [];
    vm.selectedProjects = [];

    vm.removeProject = removeProject;
    vm.editProject = editProject;
    vm.loadAllProjects = loadAllProjects;
    vm.launchModal = launchModal;
    vm.setFormClass = setFormClass;
    vm.toggleProject = toggleProject;

    //ui-sref="Landing.Projects.Manage({projectIndex: $index})"
    //projects.ng-click="projects.removeProject()

    //////////
    function editProject() {
      vm.setFormClass('side-form-100');
      $state.go('Landing.Projects.Manage', { projectIndex: vm.selectedProjects[0] })
    }

    function toggleProject(index) {
      if (vm.isProjectSelected[index]) {
        vm.isProjectSelected[index] = undefined;
        _.pull(vm.selectedProjects, index);
      } else {
        vm.isProjectSelected = [];
        vm.selectedProjects = [];

        vm.isProjectSelected[index] = true;
        vm.selectedProjects.push(index);
      }

      if (vm.selectedProjects.length > 1) {
        vm.isEditDisabled = true;
        vm.isDeleteDisabled = false;
      } else if (vm.selectedProjects.length === 1) {
        vm.isEditDisabled = false;
        vm.isDeleteDisabled = false;
      } else {
        vm.isEditDisabled = true;
        vm.isDeleteDisabled = true;
      }
    }

    function removeProject() {
      var index = vm.selectedProjects[0];
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
      vm.formClass = 'side-form-80';
      if (projectI >= 0) {
        var orgId = vm.myProjects[projectI].org_id;
        ProjectsService.setCurrProjectOrgId(orgId);
      }

      $state.go("Landing.Projects.AddProject", {
        'projectI': projectI
      });
    }

    function setFormClass(classname) {
      vm.formClass = classname;
    }

    function init() {
      vm.loadAllProjects();
    }

    init();
  }
})();
