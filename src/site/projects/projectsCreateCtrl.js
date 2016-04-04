(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('ProjectsCreateCtrl', ProjectsCreateCtrl);

  /* @ngInject */
  function ProjectsCreateCtrl($log, $state, IdpClient, IfProjects, IfStudioClient, ProjectsService) {
    var vm = this;

    vm.currProject = undefined;

    //////////
 
    vm.submitNewProject = function() {
      $log.log("submitting new project", vm.currProject);
      IfStudioClient.registerProject(vm.currProject, function(data) {
        $log.log("Created new project", data);
        $state.go('Projects');
      }, function(error) {
        $log.log("Failed to create project", error);
      });
    };


    function init() {
      vm.currProject = angular.copy(ProjectsService.getCurrProject());
    }

  }
})();
