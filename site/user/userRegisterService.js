(function() {

  'use strict';

  angular
    .module('devPortal')
    .factory('UserRegisterService', UserRegisterService);

  /* @ngInject */
  function UserRegisterService($resource, IfStudioClient) {
    return $resource(IfStudioClient.apiBase + 'register/:orgId/accounts/:accountId', {
      orgId: '@orgId',
      accountId: '@accountId'
    }, {
      'update': { method: 'PUT' }
    });
  }
})();
