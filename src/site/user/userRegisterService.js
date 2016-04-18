(function() {

  'use strict';

  angular
    .module('devPortal')
    .factory('UserRegisterService', UserRegisterService);

  /* @ngInject */
  function UserRegisterService($resource) {
    var apiBase = 'https://dev-portal-service.appspot.com/api/v1';

    return $resource(apiBase + '/register/:orgId/accounts/:accountId', {
      orgId: '@orgId',
      accountId: '@accountId'
    });
  }
})();
