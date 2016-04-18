(function() {

  'use strict';

  angular
    .module('devPortal')
    .factory('UserInviteService', UserInviteService);

  /* @ngInject */
  function UserInviteService($resource) {
    var apiBase = 'https://dev-portal-service.appspot.com/api/v1';

    return $resource(apiBase + '/invites/:orgId/:action', {
      orgId: '@orgId',
      action: '@action'
    }, {
      'update': { method: 'PUT' }
    });
  }
})();
