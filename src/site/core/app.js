'use strict';

// .module('devPortal', ["ui.router"])
angular.module('Core', ["ui.router"])
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state("Home", {
      templateUrl: '/site/home/home-tab.html'
    });

    $stateProvider.state("Issues", {
      templateUrl: '/site/search/search-tab.html'
    });

    $stateProvider.state("Projects", {
      templateUrl: '/site/projects/projects-tab-all.html',
      controller: 'ProjectsCtrl',
      controllerAs: 'projects'
    });

    $stateProvider.state("ProjectsCreate", {
      templateUrl: '/site/projects/projects-tab-create.html',
      controller: 'ProjectsCreateCtrl',
      controllerAs: 'projects'
    });

    $stateProvider.state("ProjectsManage.Default", {
      views: {
        "modal": {
          template: '<div></div>'
        }
      }
    });

    $stateProvider.state("ProjectsManage", {
      params : {
        projectIndex: null
      },
      templateUrl: '/site/projects/projects-tab-manage.html',
      controller: 'ProjectsManageCtrl',
      controllerAs: 'projects'
    });

    $stateProvider.state("ProjectsManage.AppInput", {
      parent: 'ProjectsManage',
      views: {
        "modal": {
          templateUrl: '../site/application/appInputModal.html',
          controller: 'AppInputModalCtrl',
          controllerAs: 'appInputCtrl'
        }

      }
    });

    $urlRouterProvider.otherwise('/');
  });
