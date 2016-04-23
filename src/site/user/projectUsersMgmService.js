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
      getUsersByRole: getUsersByRole,
      updateUserRoles: updateUserRoles,
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
        action: 'add'
      }, invites).$promise;
    }

    function deleteInviteRole(orgId, invite) {
      return UserInviteService.update({
        orgId: orgId,
        action: 'remove'
      }, invite).$promise;
    }

    function getUsersByRole(orgId, role) {
      return UserRegisterService.query({
        orgId: orgId,
        role: role
      }).$promise;
    }

    function updateUserRoles(orgId, accountId, roles) {
      return UserRegisterService.update({
        orgId: orgId,
        accountId: accountId,
      }, roles).$promise;
    }

    function deleteUser(orgId, accountId) {
      return UserRegisterService.delete({
        orgId: orgId,
        accountId: accountId
      }).$promise;
    }

    function selfOnBoard() {

    }

  }


})();
