(function() {
  'use strict';

  angular
    .module('devPortal')
    .factory('ProjectModel', ProjectModel);

  /* @ngInject */
  function ProjectModel($q, ProjectUsersMgmService) {
    var model = {
      userRoleInvites: [],
      adminRoleInvites: [],
      invites: [],
      users: [],
      roles: ['ADMIN', 'USER'],
      projectId: undefined,
      userListByRolePromises: [],
      userListByRole: []
    };

    return {
      get: get,
      listInvites: listInvites,
      setProjectId: setProjectId,
      listUsers: listUsers
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

    function listUsers() {
      model.users = [];

      // var _p = listUsersByRole;
      // while () {
      //   _p = _p.finally(listUserByRole);
      // }
      model.userListByRolePromises = [];
      _.each(model.roles, function(role) {
        model.userListByRolePromises.push(ProjectUsersMgmService.getUsersByRole(model.projectId, role).then(function(data) {
          model.userListByRole[role] = data;
          model.userListByRole[role] = _.map(model.userListByRole[role], function(user) {
            user.role = role;
            return user;
          });
        }, function() {
          model.userListByRole[role] = [];
        }));
      });

      var _promise = $q.allSettled(model.userListByRolePromises).then(function() {
        _.each(model.roles, function(role) {
          if (model.userListByRole[role].length > 0) {
            model.users = _.concat(model.users, model.userListByRole[role]);
          }
        });
      });

      return _promise;
    }

    function setProjectId(projectId) {
      model.projectId = projectId;
    }
  }

})();
