(function() {

  'use strict';

  angular
    .module('projects-templates')
    .factory('AppService', AppService);

  function App() {
    this.app_type = '';
    this.app_secret = '';
    this.encryption_key = '';
    this.redirect_urls = [];
    this.privacy_url = '';
    this.app_name = '';
    this.app_info = '';
  };

  /* *ngInject */
  function AppService($log, IfStudioClient) {

    var app = {
      app_type: '',
      app_secret: '',
      encryption_key: '',
      redirect_urls: [],
      privacy_url: '',
      app_name: '',
      app_info: ''
    };

    var model = {
      currAppIndex: 0,
      currApp: {
        "app_type": "backend_app",
        "app_secret": "Secret123",
        "encryption_key": "a.secret.key",
        "redirect_urls": [
          "http://localhost:8080"
        ],
        "privacy_url": "http://localhost:8080/privacy.html",
        "app_name": "app1",
        "app_info": "a test app for testing"
      },
      appList: [{
        "app_type": "backend_app",
        "app_secret": "Secret123",
        "encryption_key": "a.secret.key",
        "redirect_urls": [
          "http://localhost:8080"
        ],
        "privacy_url": "http://localhost:8080/privacy.html",
        "app_name": "app1",
        "app_info": "a test app for testing"
      }, {
        "app_type": "endpoint_app",
        "app_secret": "Secret123",
        "encryption_key": "a.secret.key",
        "redirect_urls": [
          "http://localhost:8080"
        ],
        "privacy_url": "http://localhost:8080/privacy.html",
        "app_name": "app2",
        "app_info": "a test app for testing"
      }, {
        "app_type": "endpoint_app",
        "app_secret": "Secret123",
        "encryption_key": "a.secret.key",
        "redirect_urls": [
          "http://localhost:8080"
        ],
        "privacy_url": "http://localhost:8080/privacy.html",
        "app_name": "app3",
        "app_info": "a test app for testing"
      }]
    };

    var service = {
      newApp: newApp,
      getAllApps: getAllApps,
      updateApp: updateApp,
      createApp: createApp,
      getAppModel: getAppModel,
      initAppModel: initAppModel
    }

    return service;

    //////////
    function noop() {

    }

    function newApp() {
      return new App();
    }

    function getAllApps(orgId) {
      return IfStudioClient.getAllApps(orgId, noop, noop);
    }

    function updateApp(orgId, appId, app) {
      return IfStudioClient.updateApp(orgId, appId, app, noop, noop);
    }

    function createApp(orgId, app) {
      return IfStudioClient.registerApp(orgId, app, noop, noop);
    }

    function getAppModel() {
      return model;
    }

    function initAppModel() {
      model = {};
    }

  }
})();
