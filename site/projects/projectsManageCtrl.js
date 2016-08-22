(function() {

  'use strict';

  angular
    .module('projects-templates')
    .controller('ProjectsManageCtrl', ProjectsManageCtrl);

  /* @ngInject */
  function ProjectsManageCtrl($q, $log, $state, $stateParams, IfStudioClient, ProjectsService) {
    var vm = this;

    vm.currProject = undefined;
    vm.appList = undefined;
    vm.projectIndex = undefined;

    vm.launchProjectModal = launchProjectModal;
    vm.populateUI = populateUI;
    vm.close = close;

    //////////

    function close() {
      $state.go("Landing.Projects");
    }

    function launchProjectModal(projectIndex) {
      $state.go("Landing.Projects.Manage.UpdateProject", {
        'projectI': projectIndex
      });
    }

    function loadProject() {
      return ProjectsService.readProject(vm.projectIndex).then(function(data) {
        $log.log("got project details", data);
      }, function(error) {
        $log.log("Failed to get project", error);
      });
    }

    function loadApps() {
      return ProjectsService.listApplications();
    }

    function loadUsers() {
      return ProjectsService.listUsers();
    }

    function loadInvites() {
      return ProjectsService.listInvites();
    }

    function populateUI(index) {
      ProjectsService.getCurrProject().org_name = vm.myProjects[index].org_name;
      loadProject().finally(loadApps).finally(loadUsers).finally(loadInvites);
    }

    function init() {
      vm.formClass = 'side-form-80';
      ProjectsService.clearModel();

      vm.myProjects = ProjectsService.getAllProjects();
      vm.projectIndex = $stateParams.projectIndex;
      ProjectsService.setProjectIndex(vm.projectIndex);
      var orgId = vm.myProjects[vm.projectIndex].org_id;
      ProjectsService.setCurrProjectOrgId(orgId);

      vm.currProject = ProjectsService.getCurrProject();

      vm.populateUI(vm.projectIndex);

    }

    init();
  }
})();
