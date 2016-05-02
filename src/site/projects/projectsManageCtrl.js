(function() {

  'use strict';

  angular
    .module('projects-templates')
    .controller('ProjectsManageCtrl', ProjectsManageCtrl);

  /* @ngInject */
  function ProjectsManageCtrl($q, $log, $state, $stateParams, IfStudioClient, AppService, ProjectsService) {
    var vm = this;

    vm.currProject = undefined;
    vm.appList = undefined;
    vm.projectIndex = undefined;

    vm.launchApplicationModal = launchApplicationModal;
    vm.launchProjectModal = launchProjectModal;
    vm.removeApp = removeApp;
    vm.populateUI = populateUI;

    //////////

    function launchApplicationModal(appIndex) {
      $state.go("Projects.Edit.Application", {
        'appIndex': appIndex
      });
    }

    function launchProjectModal() {
      $state.go("Projects.Edit.Project", {
        'projectI': vm.projectIndex
      });
    }

    function removeApp(appIndex) {
      AppService.deleteApp(ProjectsService.getCurrProjectOrgId(), vm.appList[appIndex].client_id, function(appId) {
        vm.appList.splice(appIndex, 1);
      }, function() {
        // Notification failure
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
      return AppService.getAllApps(ProjectsService.getCurrProjectOrgId(), function(data) {
        AppService.setModelAppList(data);
        vm.appList = AppService.getModel().appList;
      }, function(error) {
        AppService.setModelAppList([]);
        vm.appList = AppService.getModel().appList;
      });
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
      ProjectsService.clearModel();

      vm.myProjects = ProjectsService.getAllProjects();
      vm.projectIndex = $stateParams.projectIndex;
      var orgId = vm.myProjects[vm.projectIndex].org_id;
      ProjectsService.setCurrProjectOrgId(orgId);

      vm.currProject = ProjectsService.getCurrProject();

      vm.populateUI(vm.projectIndex);

      // vm.appModel.modelReady.then(function() {
      //   vm.appList = vm.appModel.appList;
      // });
    }

    init();
  }
})();
