(function() {

  'use strict';

  angular
    .module('projects-templates')
    .controller('AppInputModalCtrl', AppInputModalCtrl);

  /* *ngInject */
  function AppInputModalCtrl($log, $state, IfStudioClient, AppService) {
    var vm = this;

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
      if (vm.appModel.currAppIndex < 0) {
        AppService.createApp(vm.model.orgId, app).then(function(appId) {
          vm.app.client_id = appId;
          vm.appModel.appList[vm.appModel.appList.length] = angular.copy(vm.app);
        }, function() {

        });
      } else {
        AppService.createApp(vm.model.orgId, vm.app.client_id, app).then(function(appId) {
          vm.appModel.appList[vm.appModel.currAppIndex] = angular.copy(vm.app);
        }, function() {

        });
      }
    }

    function init() {
      vm.appModel = AppService.getAppModel();

      // populate UI
      var appIndex = vm.appModel.currAppIndex;
      if (appIndex < 0) {
        vm.app = AppService.newApp();
      } else {
        vm.app = angular.copy(vm.appModel.appList[appIndex]);
      }

      $('#myModal').modal()
      $('#myModal').on('hidden.bs.modal', function(e) {
        vm.close();
      })
    }

    init();
  }
})();
