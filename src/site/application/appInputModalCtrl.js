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

    //////////

    function close() {
      $('#myModal').off('hidden.bs.modal');
      $state.go('ProjectsManage');
    }

    function done() {
      var app = angular.copy(vm.app);
      delete app.client_id;
      if (vm.appIndex < 0) {
        app.redirect_urls = ["abc"];
        AppService.createApp(AppService.getModelProjectOrgId(), app, function(appId) {
          // vm.app.client_id = appId;
          // vm.appModel.appList[vm.appModel.appList.length] = angular.copy(vm.app);
        }, function() {

        });
      } else {
        AppService.updateApp(AppService.getModelProjectOrgId(), vm.app.client_id, app, function(appId) {
          // vm.appModel.appList[vm.appModel.currAppIndex] = angular.copy(vm.app);
        }, function() {

        });
      }
    }

    function init() {
      vm.appList = AppService.getModelAppList();
      vm.appIndex = $stateParams.appIndex;


      // populate UI
      if (vm.appIndex < 0) {
        vm.app = AppService.newApp();
      } else {
        vm.app = angular.copy(vm.appList[vm.appIndex]);
      }

      $('#myModal').modal()
      $('#myModal').on('hidden.bs.modal', function(e) {
        vm.close();
      })
    }

    init();
  }
})();
