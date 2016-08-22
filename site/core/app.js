(function() {
  'use strict';

  // .module('devPortal', ["ui.router"])
  angular
    .module('Core', ['ui.router', 'ngResource', 'ngPromiseExtras', 'ngMaterial', 'ngAnimate', 'ncy-angular-breadcrumb'])
    // .factory('HttpHeaderInterceptor', ['$window', function($window) {
    //   return {
    //     request: function(config) {
    //       config.headers = config.headers || {};
    //       config.headers.Authorization = 'Bearer ' + JSON.parse($window.sessionStorage.token);
    //       return config;
    //     }
    //   };
    // }])
    .config(function($breadcrumbProvider) {
      $breadcrumbProvider.setOptions({
        prefixStateName: 'Landing',
        template: 'bootstrap3'
      });
    })
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('HttpHeaderInterceptor');
    }])
    .config(function($mdThemingProvider, $mdIconProvider, $stateProvider, $urlRouterProvider) {

      $mdIconProvider
        .defaultIconSet("./assets/svg/avatars.svg", 128)
        .icon("menu", "./assets/svg/menu.svg", 24)
        .icon("share", "./assets/svg/share.svg", 24)
        .icon("google_plus", "./assets/svg/google_plus.svg", 512)
        .icon("hangouts", "./assets/svg/hangouts.svg", 512)
        .icon("twitter", "./assets/svg/twitter.svg", 512)
        .icon("phone", "./assets/svg/phone.svg", 512);

      $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');
      // $stateProvider.state("Modal", {
      //   template: '<div ui-view></div>',
      //   onEnter: function() {
      //     // save current state
      //     // open modal
      //     $('#projectModal').modal();
      //     $('#projectModal').on('hidden.bs.modal', function(e) {
      //       vm.close();
      //     });
      //   },
      //   onExit: function() {
      //     // return to current state
      //     $state.go();
      //   }
      // });

      $stateProvider.state("Home", {
          template: '<ui-view/>',
          controller: function($state, IdpClient) {
            if (IdpClient.isAuthorized('USER', 'devnet-alpha.integratingfactor.com')) {
              $state.transitionTo('Home.User');
            } else {
              $state.transitionTo('Home.Guest');
            }
          }
        })
        .state('Home.Guest', {
          templateUrl: '/site/home/home-tab-guest.html',
          controller: 'SectionsCtrl',
          controllerAs: 'sections'
        })
        .state('Home.User', {
          templateUrl: '/site/home/home-tab-user.html'
        });

      $stateProvider.state("GoHome", {
        controller: function($state) {
          $state.transitionTo('Home');
        }
      });

      $stateProvider.state("Issues", {
        templateUrl: '/site/search/search-tab.html'
      });

      $stateProvider
        .state("Landing", {
          templateUrl: 'site/common/landing.html',
          controller: 'LandingCtrl',
          controllerAs: 'landing',
          ncyBreadcrumb: {
            label: 'If Portal'
          }
        })
        .state("Landing.Login", {
          template: '',
          controller: 'LoginCtrl',
          ncyBreadcrumb: {
            label: 'Login'
          }
        })
        .state("Landing.Home", {
          controller: function($state, IdpClient) {
            if (IdpClient.isAuthorized('USER', 'devnet-alpha.integratingfactor.com')) {
              $state.transitionTo('Landing.User');
            } else {
              $state.transitionTo('Landing.Guest');
            }
          }
        })
        .state('Landing.Guest', {
          templateUrl: 'site/home/home-tab-guest.html',
          controller: 'SectionsCtrl',
          controllerAs: 'sections',
          ncyBreadcrumb: {
            label: 'Home'
          }
        })
        .state('Landing.User', {
          templateUrl: 'site/home/home-tab-user.html',
          ncyBreadcrumb: {
            label: 'Home'
          }
        })
        .state("Landing.Projects", {
          templateUrl: 'site/projects/projects-tab-all.html',
          controller: 'ProjectsCtrl',
          controllerAs: 'projects',
          ncyBreadcrumb: {
            label: 'Projects'
          }
        })
        .state("Landing.Projects.AddProject", {
          params: {
            projectI: null
          },
          views: {
            "modal": {
              templateUrl: 'site/projects/projectEdit.html',
              controller: 'ProjectEditCtrl',
              controllerAs: 'project',
            }
          },
          ncyBreadcrumb: {
            label: 'Add Project'
          }
        })
        .state("Landing.Projects.Manage", {
          params: {
            projectIndex: null
          },
          views: {
            "modal": {
              templateUrl: 'site/projects/projectManage.html',
              controller: 'ProjectsManageCtrl',
              controllerAs: 'projectManage'
            }
          },
          ncyBreadcrumb: {
            label: '{{projectManage.currProject.org_name}}'
          }
        })
        .state("Landing.Projects.Manage.UpdateProject", {
          params: {
            projectI: null
          },
          views: {
            "modal2": {
              templateUrl: 'site/projects/projectEdit.html',
              controller: 'ProjectEditCtrl',
              controllerAs: 'project'
            }
          },
          ncyBreadcrumb: {
            label: 'Edit Project'
          }
        })
        .state("Landing.Projects.Manage.EditApplication", {
          params: {
            appIndex: null
          },
          views: {
            "modal2": {
              templateUrl: 'site/application/appInputModal.html',
              controller: 'AppInputModalCtrl',
              controllerAs: 'appInputCtrl'
            }
          },
          ncyBreadcrumb: {
            label: 'Edit Application'
          }
        })
        .state("Landing.Projects.Manage.EditUser", {
          params: {
            userI: null,
            role: ''
          },
          views: {
            "modal2": {
              templateUrl: 'site/user/userModal.html',
              controller: 'UserModalCtrl',
              controllerAs: 'userModalCtrl'
            }
          },
          ncyBreadcrumb: {
            label: 'Edit User'
          }
        })
        .state("Landing.Projects.Manage.EditInvite", {
          params: {
            inviteI: null,
            role: ''
          },
          views: {
            "modal2": {
              templateUrl: 'site/user/inviteModal.html',
              controller: 'InviteModalCtrl',
              controllerAs: 'inviteModalCtrl'
            }
          },
          ncyBreadcrumb: {
            label: 'Edit Invite'
          }
        });

      $urlRouterProvider.otherwise('/');
    })
    .run(['$state', function($state) {
      $state.transitionTo('Landing');
    }]);
})();
