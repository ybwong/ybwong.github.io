(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('UsersCtrl', UsersCtrl);

  /* @ngInject */
  function UsersCtrl($state, $stateParams, ProjectsService, ProjectUsersMgmService, ProjectModel) {
    var vm = this;
    vm.projectId = undefined;

    vm.launchModal = launchModal;

    //////////

    function launchModal(userI, role) {
      $state.go("ProjectsManage.User", {
        'userI': userI,
        'role': role
      });
    }

    function init() {
      var myProjects = ProjectsService.getAllProjects();
      var projectIndex = $stateParams.projectIndex;
      vm.projectId = myProjects[projectIndex].org_id;

      vm.projectModel = ProjectModel.get();
      ProjectModel.setProjectId(vm.projectId);
      ProjectModel.listUsers();
    }

    init();
  }

})();
