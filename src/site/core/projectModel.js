(function() {
  'use strict';

  angular
    .module('devPortal')
    .factory('ProjectModel', ProjectModel);

  /* @ngInject */
  function ProjectModel(ProjectUsersMgmService) {
    var model = {
      userRoleInvites: [],
      adminRoleInvites: [],
      invites: [],
      projectId: undefined
    };

    return {
      get: get,
      set: set,
      listInvites: listInvites,
      setProjectId: setProjectId
    };

    function get() {
      return model;
    }

    function set(mdl) {
      model = mdl;
    }

    function listInvitesByUserRole() {
      model.userRoleInvites = [];      
      return ProjectUsersMgmService.getInvites(model.projectId, 'USER').then(function(data) {
        model.userRoleInvites = data;
        model.userRoleInvites = _.map(model.userRoleInvites, function(invite) {
          invite.role = 'USER';
          return invite;
        });
      });
    }

    function listInvitesByAdminRole() {
      model.adminRoleInvites = [];      
      return ProjectUsersMgmService.getInvites(model.projectId, 'ADMIN').then(function(data) {
        model.adminRoleInvites = data;
        model.adminRoleInvites = _.map(model.adminRoleInvites, function(invite) {
          invite.role = 'ADMIN';
          return invite;
        });
      });
    }

    function listInvites() {
      return listInvitesByUserRole().finally(listInvitesByAdminRole).finally(function() {
        model.invites = _.concat(model.userRoleInvites, model.adminRoleInvites);
      });
    }

    function setProjectId(projectId) {
      model.projectId = projectId;
    }
  }

})();
