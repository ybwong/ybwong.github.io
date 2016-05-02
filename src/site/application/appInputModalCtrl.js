(function() {

  'use strict';

  angular
    .module('projects-templates')
    .controller('AppInputModalCtrl', AppInputModalCtrl);

  /* *ngInject */
  function AppInputModalCtrl($log, $state, $stateParams, IfStudioClient, AppService, ProjectsService) {
    var vm = this;

    vm.appIndex = undefined;
    vm.isDisabled = false;

    vm.app = {
      app_type: "endpoint_app",
      app_secret: "",
      encryption_key: "",
      redirect_urls: [],
      privacy_url: "",
      app_name: "",
      app_info: ""
    };

    vm.close = close;
    vm.done = done;
    vm.add = add;
    vm.remove = remove;

    //////////

    function close() {
      $('#myModal').off('hidden.bs.modal');
      $state.go('Projects.Edit');
    }

    function done() {
      var app = angular.copy(vm.app);
      delete app.client_id;
      app.redirect_urls = app.redirect_urls.map(
        function(elem) {
          return elem.url;
        }
      );
      if (vm.appIndex < 0) {
        AppService.createApp(ProjectsService.getCurrProjectOrgId(), app, function(appId) {
          vm.app.client_id = appId.client_id;
          vm.appModel.appList[vm.appModel.appList.length] = angular.copy(vm.app);
        }, function() {
          // Notification failure
        });
      } else {
        AppService.updateApp(ProjectsService.getCurrProjectOrgId(), vm.app.client_id, app, function(appId) {
          vm.appModel.appList[vm.appIndex] = angular.copy(vm.app);
          vm.appModel.appList[vm.appIndex].redirect_urls = vm.appModel.appList[vm.appIndex].redirect_urls.map(
            function(elem) {
              return elem.url;
            }
          );
        }, function() {
          // Notification failure          
        });
      }
    }

    function add() {
      vm.app.redirect_urls[vm.app.redirect_urls.length] = {
        'url': ''
      };
    }

    function remove(index) {
      vm.app.redirect_urls.splice(index, 1);
    }

    function init() {
      vm.appModel = AppService.getModel();
      vm.appIndex = $stateParams.appIndex;


      // populate UI
      if (vm.appIndex < 0) {
        vm.app = AppService.newApp();
        vm.isDisabled = false;
      } else {
        vm.isDisabled = true;
        vm.clientId = vm.appModel.appList[vm.appIndex].client_id;
        AppService.getApp(ProjectsService.getCurrProjectOrgId(), vm.clientId,
          function(data) {
            vm.app = data;
            vm.app.redirect_urls = vm.app.redirect_urls.map(
              function(elem) {
                return {
                  'url': elem
                };
              });
            if (vm.app.redirect_urls.length === 0) {
              vm.app.redirect_urls.length[0] = '';
            }
          },
          function(error) {
            // notification
          });
      }

      $('#myModal').modal();
      $('#myModal').on('hidden.bs.modal', function(e) {
        vm.close();
      });
    }

    init();
  }
})();
