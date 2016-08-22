(function() {
  'use strict';
  angular
    .module('Core')
    .factory('HttpHeaderInterceptor', HttpHeaderInterceptor);

  /* @ngInject */
  function HttpHeaderInterceptor($window) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token !== 'undefined') {
          config.headers.Authorization = 'Bearer ' + JSON.parse($window.sessionStorage.token);
        }
        return config;
      }
    };
  }
})();
