(function() {

  'use strict';

  angular
    .module('devPortal')
    .factory('ProjectsService', ProjectsService);

  /* @ngInject */
  function ProjectsService() {

    var model = {};
    model.myProjects = [];
    model.currProject = {};
    model.myApps = [];
    model.currApp = {};
    model.attempt = 0;
    model.state = 'all';

    return {
      reset: reset,
      startNewProject: startNewProject,
      getCurrProject: getCurrProject,
      setCurrProject: setCurrProject,
      getAllProjects: getAllProjects,
      setAllProjects: setAllProjects
    };

    function reset() {
      model.myProjects = [];
      model.currProject = {};
      model.attempt = 0;
      model.state = 'all';

      model.curr_roles = '';
    }

    function startNewProject() {
      model.currProject = {};
      model.state = 'create';
      model.curr_roles = '';
    }

    function setCurrProject(orgId, currProject, state, currRoles) {
      model.currProjectOrgId = orgId;
      model.currProject = angular.copy(currProject);
      model.state = state;
      model.curr_roles = '';
    }

    function getCurrProject() {
      return model.currProject;
    }

    function getAllProjects() {
      return model.myProjects;
    }

    function setAllProjects(myProjects) {
      model.myProjects = myProjects;
    }
  }
})();
