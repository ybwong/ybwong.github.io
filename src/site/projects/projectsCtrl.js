(function() {

  'use strict';

  angular
    .module('devPortal')
    .controller('ProjectsCtrl', ProjectsCtrl);

  /* @ngInject */
  function ProjectsCtrl($log, IdpClient, IfProjects, IfStudioClient, ProjectsService) {
    var vm = this;

    vm.startNewProject = startNewProject;
    vm.removeProject = removeProject;
    vm.loadAllProjects = loadAllProjects;
    vm.startProjectUpdate = startProjectUpdate;

    //////////

    function startNewProject() {
      ProjectsService.setCurrProject({}, 'create');
    }

    function removeProject(index) {
      $log.log("removing project", vm.myProjects[index].org_id);
      IfStudioClient.removeProject(vm.myProjects[index].org_id, function(data) {
        $log.log("removed project", data);
        vm.myProjects.splice(index, 1);
      }, function(error) {
        $log.log("Failed to removed project", error);
      });
    }

    function loadAllProjects() {
      if (!IdpClient.isAuthorized('USER', 'devnet-alpha.integratingfactor.com')) {
        return;
      }
      IfProjects.loadAllProjects(function() {
        vm.myProjects = IfProjects.getAllProjects();
        ProjectsService.setAllProjects(vm.myProjects);
      });
    }

    function startProjectUpdate(index) {
      var curr_roles = '';
      var orgId = vm.myProjects[index].org_id;
      var currProject;

      $log.log("requesting project", orgId);
      IfStudioClient.getProjectDetails(orgId, function(data) {
        $log.log("got project details", data);
        currProject = data;
        if (data.org_roles && data.org_roles.length > 0) {
          curr_roles = data.org_roles.toString();
        } else {
          curr_roles = undefined;
        }
        ProjectsService.setCurrProject(currProject, 'create', curr_roles);
      }, function(error) {
        $log.log("Failed to get project", error);
      });
    }

    function init() {
      vm.loadAllProjects();
    }

    init();
  }
})();
