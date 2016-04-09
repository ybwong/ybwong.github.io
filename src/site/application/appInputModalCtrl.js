(function() {

  'use strict';

  angular
    .module('projects-templates')
    .controller('AppInputModalCtrl', AppInputModalCtrl);

  /* *ngInject */
  function AppInputModalCtrl($log, $state, $stateParams, IfStudioClient, AppService) {
    var vm = this;

    vm.appIndex = undefined;

    vm.app = {
      app_type: "",
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
      $state.go('ProjectsManage');
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
        AppService.createApp(AppService.getModelProjectOrgId(), app, function(appId) {
          vm.app.client_id = appId.client_id;
          vm.appModel.appList[vm.appModel.appList.length] = angular.copy(vm.app);
        }, function() {
          // Notification failure
        });
      } else {
        AppService.updateApp(AppService.getModelProjectOrgId(), vm.app.client_id, app, function(appId) {
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
      } else {
        vm.clientId = vm.appModel.appList[vm.appIndex].client_id;
        AppService.getApp(AppService.getModelProjectOrgId(), vm.clientId,
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

      $('#myModal').modal()
      $('#myModal').on('hidden.bs.modal', function(e) {
        vm.close();
      })
    }

    init();
  }
})();
