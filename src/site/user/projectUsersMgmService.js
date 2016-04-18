(function() {

  'use strict';

  angular
    .module('devPortal')
    .factory('ProjectUsersMgmService', ProjectUsersMgmService);

  /* @ngInject */
  function ProjectUsersMgmService(UserInviteService, UserRegisterService) {
    return {
      getInvites: getInvites,
      addInvites: addInvites,
      deleteInviteRole: deleteInviteRole,
      listUsers: listUsers,
      updateUserRole: updateUserRole,
      deleteUser: deleteUser,
      selfOnBoard: selfOnBoard
    };

    /* role: 'USER', 'ADMIN' */
    function getInvites(orgId, role) {
      return UserInviteService.query({
        orgId: orgId,
        role: role
      }).$promise;
    }
    /* 
    invite: {
      id_key: 'test@gmail.com',
        id_type: 'email',
        user_roles:  [
        "USER",
        "ADMIN"
        ]
      }
    */
    function addInvites(orgId, invites) {
      return UserInviteService.update({
        orgId: orgId,
        action: 'add',
      }, invites).$promise;
    }

    function deleteInviteRole(orgId, invite) {
      return UserInviteService.update({
        orgId: orgId,
        action: 'remove',
      }, invite).$promise;
    }

    function listUsers(orgId, roles) {
      return UserRegisterService.get({
        orgId: orgId,
        user_roles: roles
      }).$promise;
    }

    function updateUserRole(orgId, accountId, role) {
      return UserRegisterService.get({
        orgId: orgId,
        accountId: accountId,
      }, role).$promise;
    }

    function deleteUser(orgId, accountId) {
      return UserRegisterService.get({
        orgId: orgId,
        accountId: accountId,
      }).$promise;
    }

    function selfOnBoard() {

    }

  }


})();
