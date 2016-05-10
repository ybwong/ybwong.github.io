(function() {

  'use strict';

  angular
    .module('devPortal')
    .factory('UserInviteService', UserInviteService);

  /* @ngInject */
  function UserInviteService($resource, IfStudioClient) {
    return $resource(IfStudioClient.apiBase + 'invites/:orgId/:action', {
      orgId: '@orgId',
      action: '@action'
    }, {
      'update': { method: 'PUT' }
    });
  }
})();
