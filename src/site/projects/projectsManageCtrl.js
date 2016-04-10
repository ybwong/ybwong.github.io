(function() {

  'use strict';

  angular
    .module('projects-templates')
    .controller('ProjectsManageCtrl', ProjectsManageCtrl);

  /* *ngInject */
  function ProjectsManageCtrl($log, $state, $stateParams, IfStudioClient, AppService, ProjectsService) {
    var vm = this;

    vm.currProject = undefined;
    vm.appList = undefined;

    vm.add = add;
    vm.launchModal = launchModal;
    vm.removeApp = removeApp;
    vm.startProjectUpdate = startProjectUpdate;

    //////////

    function launchModal(appIndex) {
      $state.go("ProjectsManage.AppInput", {
        'appIndex': appIndex
      });
    }

    function removeApp(appIndex) {
      AppService.deleteApp(AppService.getModelProjectOrgId(), vm.appList[appIndex].client_id, function(appId) {
        vm.appList.splice(appIndex, 1);
      }, function() {
        // Notification failure
      });

    }

    function add(orgId) {
      $log.log('projectManageCtrl.add()');

      var app = {
        "app_type": "backend_app",
        "app_secret": "Secret123",
        "encryption_key": "a.secret.key",
        "redirect_urls": [
          "http://localhost:8080"
        ],
        "privacy_url": "http://localhost:8080/privacy.html",
        "app_name": "test app",
        "app_info": "a test app for testing"
      };

      var appId;
      var p1 = IfStudioClient.getAllApps(orgId, function(data) {
        $log.log('data ' + data);
        appId = data[0].client_id;
      }, function(response) {
        $log.log('response ' + response);
      });

      var p2 = p1.then(function(data) {
        return IfStudioClient.deleteApp(orgId, data[0].client_id, function(data) {
          $log.log('delete success');
        }, function(response) {
          $log.log('delete fail');
        });
      }).then(function(data) {
        return IfStudioClient.registerApp(orgId, app, function(data) {
          $log.log('register success');
        }, function(response) {
          $log.log('register failed');
        });
      });


      p2.then(function(data) {
        return IfStudioClient.getAllApps(orgId, function(data) {
          $log.log('data ' + data);
        }, function(response) {
          $log.log('response ' + response);
        });
      });
    }

    vm.submitProjectUpdate = function() {
      $log.log("submitting project update", vm.currProject);
      var orgId = vm.myProjects[vm.projectIndex].org_id;
      IfStudioClient.updateProject(orgId, vm.currProject, function(data) {
        $log.log("updated project", data);
        // vm.reset();
      }, function(error) {
        $log.log("Failed to update project", error);
        // vm.reset();
      });
    };

    function startProjectUpdate(index) {
      var curr_roles = '';
      var orgId = vm.myProjects[index].org_id;
      var currProject;

      $log.log("requesting project", orgId);
      IfStudioClient.getProjectDetails(orgId, function(data) {
        $log.log("got project details", data);
        vm.currProject = data;
        if (data.org_roles && data.org_roles.length > 0) {
          curr_roles = data.org_roles.toString();
        } else {
          curr_roles = undefined;
        }
        ProjectsService.setCurrProject(orgId, vm.currProject, 'create', curr_roles);
        AppService.getAllApps(orgId, function(data) {
          AppService.setModelProjectOrgId(orgId);
          AppService.setModelAppList(data);
          vm.appList = AppService.getModel().appList;
        }, function(error) {
          AppService.setModelProjectOrgId(orgId);
          AppService.setModelAppList([]);
        });
      }, function(error) {

        $log.log("Failed to get project", error);
      });
    };

    function init() {
      vm.myProjects = ProjectsService.getAllProjects();
      vm.projectIndex = $stateParams.projectIndex;
      vm.startProjectUpdate(vm.projectIndex);

      // vm.appModel.modelReady.then(function() {
      //   vm.appList = vm.appModel.appList;
      // });
    }
    $log.log('projectManageCtrl.js');

    init();
  }
})();
