(function() {

  'use strict';

  angular
    .module('devPortal')
    .factory('ProjectsService', ProjectsService);

  /* @ngInject */
  function ProjectsService($q, $log, IdpClient, IfStudioClient, ProjectUsersMgmService) {

    var model = {
      currProject: {
        org_name: '',
        org_info: '',
        org_roles: [],
        org_quota: {}
      },
      currProjectOrgId: undefined,
      projects: [],

      userRoleInvites: [],
      adminRoleInvites: [],
      inviteListByRole: [],
      invites: [],
      users: [],
      defaultRoles: ['ADMIN', 'USER'],
      roles: [],
      userListByRolePromises: [],
      userListByRole: []
    };

    var newProject = {
      org_name: '',
      org_info: '',
      org_roles: []
    };

    //////////

    return {
      getRoles: getRoles,

      readProject: readProject,
      updateProject: updateProject,
      createProject: createProject,
      deleteProject: deleteProject,
      loadAllProjects: loadAllProjects,

      getCurrProject: getCurrProject,
      setCurrProject: setCurrProject,
      getAllProjects: getAllProjects,
      getCurrProjectOrgId: getCurrProjectOrgId,
      setCurrProjectOrgId: setCurrProjectOrgId,

      getModel: getModel,
      clearModel: clearModel,
      getInvites: getInvites,
      listInvites: listInvites,
      deleteInviteRole: deleteInviteRole,
      listUsers: listUsers,
      deleteUserRole: deleteUserRole,
      updateUserRoles: updateUserRoles
    };

    function getRoles() {
      return model.roles;
    }

    function readProject(projectI) {
      var deferred = $q.defer();
      var orgId = model.projects[projectI].org_id;
      IfStudioClient.getProjectDetails(orgId, function(data) {
        model.currProject = data;
        model.roles = _.concat(model.defaultRoles, getCustomRoles());
        deferred.resolve(data);
      }, function(error) {
        model.roles = _.concat(model.defaultRoles, getCustomRoles());
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function rolesChangeUpdate() {
      var newRoles = _.concat(model.defaultRoles, getCustomRoles());
      var deletedRoles = _.difference(model.roles, newRoles);
      if (deletedRoles.length > 0) {
        _.forEach(deletedRoles, function(deletedRole) {
          delete model.inviteListByRole[deletedRole];
          delete model.userListByRole[deletedRole];
        });
        _.remove(model.invites, function(invite) {
          return _.includes(deletedRoles, invite.role);
        });
        _.remove(model.users, function(user) {
          return _.includes(deletedRoles, user.role);
        });
      }
      model.roles = newRoles;
    }

    function updateProject(projectI, project) {
      var deferred = $q.defer();
      newProject = {
        org_name: project.org_name,
        org_info: project.org_info,
        org_roles: []
      };
      newProject.org_roles = angular.copy(project.org_roles);

      var orgId = model.currProjectOrgId;
      IfStudioClient.updateProject(orgId, newProject, function(data) {
        $log.log("updated project", data);
        // The returned data has the following attributes:
        // { org_id, org_name, org_info, org_type }
        angular.copy(data, model.projects[projectI]);
        angular.copy(newProject, model.currProject);
        rolesChangeUpdate();
        deferred.resolve(data);
      }, function(error) {
        $log.log("Failed to update project", error);
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function createProject(project) {
      var deferred = $q.defer();
      var newProject = {
        org_name: project.org_name,
        org_info: project.org_info,
        org_roles: []
      };

      newProject.org_roles = angular.copy(project.org_roles);
      IfStudioClient.registerProject(newProject, function(data) {
        $log.log("Created new project", data);
        // The returned data has the following attributes:
        // { org_id, org_name, org_info, org_type }
        model.projects.push(data);
        deferred.resolve(data);
      }, function(error) {
        $log.log("Failed to create project", error);
        deferred.reject(error);
      });
      return deferred.promise;
    }

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
        model.projects = _.sortBy(data, function(elem) {
          return elem.org_name;
        });
        deferred.resolve(model.projects);
      }, function(error) {
        $log.log(error);
        model.projects = [];
        deferred.reject(model.projects);
      });
      return deferred.promise;
    }

    function setCurrProject(currProject) {
      model.currProject = angular.copy(currProject);
    }

    function getCurrProject() {
      return model.currProject;
    }

    function getAllProjects() {
      return model.projects;
    }

    function getCurrProjectOrgId() {
      return model.currProjectOrgId;
    }

    function setCurrProjectOrgId(id) {
      model.currProjectOrgId = id;
    }

    function getModel() {
      return model;
    }

    function clearModel() {
      model.users = [];
      model.invites = [];
    }

    function getInvites() {
      return model.invites;
    }

    function listInvites() {
      var inviteListByRolePromises = [];
      _.each(model.roles, function(role) {
        inviteListByRolePromises.push(ProjectUsersMgmService.getInvites(model.currProjectOrgId, role).then(function(data) {
          model.inviteListByRole[role] = data;
          model.inviteListByRole[role] = _.map(model.inviteListByRole[role], function(invite) {
            invite.role = role;
            return invite;
          });
        }, function() {
          model.inviteListByRole[role] = [];
        }));
      });

      var _promise = $q.allSettled(inviteListByRolePromises).then(function() {
        var invites = [];
        _.each(model.roles, function(role) {
          if (model.inviteListByRole[role].length > 0) {
            invites = _.concat(invites, model.inviteListByRole[role]);
          }
        });
        model.invites = invites;
      });

      return _promise;
    }

    function deleteInviteRole(index) {
      var inviteI = model.invites[index];

      var invite = {
        'id_key': inviteI.id_key,
        'id_type': inviteI.id_type,
        'user_roles': [inviteI.role]
      };

      var invites = [invite];

      return ProjectUsersMgmService.deleteInviteRole(model.currProjectOrgId, invites).then(function() {
        model.invites.splice(index, 1);
      });

    }

    function getCustomRoles() {
      if (!model.currProject.org_roles) {
        return [];
      }
      var roles = _.map(model.currProject.org_roles, 'role_name');
      roles = _.sortBy(roles);
      return roles;
    }

    function listUsers() {

      // var _p = listUsersByRole;
      // while () {
      //   _p = _p.finally(listUserByRole);˜
      // }

      model.userListByRolePromises = [];
      _.each(model.roles, function(role) {
        model.userListByRolePromises.push(ProjectUsersMgmService.getUsersByRole(model.currProjectOrgId, role).then(function(data) {
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
        var users = [];
        _.each(model.roles, function(role) {
          if (model.userListByRole[role].length > 0) {
            users = _.concat(users, model.userListByRole[role]);
          }
        });
        model.users = users;
      });

      return _promise;
    }

    function updateUserRoles(orgId, user) {
      var deferred = $q.defer();
      var invite = {
        'id_key': user.username,
        'id_type': 'email',
        'user_roles': user.user_roles
      };

      ProjectUsersMgmService.deleteUser(orgId, user.account_id).then(function() {
        if (user.user_roles.length > 0) {
          var invites = [invite];
          ProjectUsersMgmService.addInvites(orgId, invites).finally(function() {
            deferred.resolve();
          });
        } else {
          deferred.resolve();
        }
      });
      return deferred.promise;
    }

    function deleteUserRole(index) {
      var userI = model.users[index];

      var relatedUsers = _.filter(model.users, function(user) {
        return userI.account_id === user.account_id;
      });
      userI.user_roles = _.map(relatedUsers, 'role');
      userI.user_roles = _.filter(userI.user_roles, function(role) {
        return role !== userI.role;
      });

      return updateUserRoles(model.currProjectOrgId, userI).then(function() {
        model.users.splice(index, 1);
      });
    }
  }
})();
