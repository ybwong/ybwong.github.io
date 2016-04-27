(function() {

  'use strict';

  angular
    .module('devPortal')
    .factory('ProjectsService', ProjectsService);

  /* @ngInject */
  function ProjectsService($q, $log, IdpClient, IfStudioClient) {

    var model = {
      currProject: {},
      projects: []
    };

    //////////

    return {
      loadAllProjects: loadAllProjects,
      deleteProject: deleteProject,

      getCurrProject: getCurrProject,
      setCurrProject: setCurrProject,
      getAllProjects: getAllProjects
    };

    function deleteProject(index) {
      var deferred = $q.defer();
      IfStudioClient.removeProject(model.projects[index].org_id, function(data) {
        deferred.resolve(data);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function loadAllProjects() {
      var deferred = $q.defer();

      if (!IdpClient.isAuthorized('USER', 'devnet-alpha.integratingfactor.com')) {
        return;
      }
      IfStudioClient.getAllProjects(function(data) {
        model.projects = data;
        deferred.resolve(model.projects);
      }, function(error) {
        $log.log(error);
        model.projects = [];
        deferred.reject(model.projects);
      });
      return deferred.promise;
    }

    function setCurrProject(orgId, currProject, currRoles) {
      model.currProjectOrgId = orgId;
      model.currProject = angular.copy(currProject);
      model.curr_roles = '';
    }

    function getCurrProject() {
      return model.currProject;
    }

    function getAllProjects() {
      return model.projects;
    }
  }
})();
