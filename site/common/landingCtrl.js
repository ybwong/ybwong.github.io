(function() {
  'use strict';

  angular
    .module('devPortal')
    .controller('LandingCtrl', LandingCtrl);

  /* @ngInject */
  function LandingCtrl($mdSidenav, $state, $log, IfProjects, IdpClient) {
    var vm = this;

    vm.tabs = [{
      name: 'Login',
      state: 'Landing.Login',
      avatar: 'svg-1',
      content: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
    }, {
      name: 'Home',
      state: 'Landing.Home',
      avatar: 'svg-1',
      content: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage cheese swiss boursin fondue caerphilly. Cow port-salut camembert de normandie macaroni cheese feta who moved my cheese babybel boursin. Red leicester roquefort boursin squirty cheese jarlsberg blue castello caerphilly chalk and cheese. Lancashire.'
    }, {
      name: 'FAQ',
      state: 'FAQ',
      avatar: 'svg-2',
      content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
    }, {
      name: 'Projects',
      state: 'Landing.Projects',
      avatar: 'svg-3',
      content: 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris.'
    }];

    vm.toggleSideMenu = toggleSideMenu;
    vm.selectTab = selectTab;

    //////////

    function toggleSideMenu() {
      $mdSidenav('left').toggle();
    }

    function selectTab(tab) {
      // if (tab.state === 'Landing.Login') {
      //   if (IdpClient.isAuthenticated()) {
      //     IdpClient.idpLogout();
      //     ref.isOperator = IdpClient.isAuthorized('OPERATION', IdpClient.idotProjectId);
      //     $state.transitionTo('GoHome');
      //   } else {
      //     $log.log("current state is", $state.current.name);
      //     IdpClient.idpLogin(function() {
      //       IfProjects.loadAllProjects(function() {
      //         $log.log('all projects loaded');
      //       });
      //     });
      //   }
      // }
    }

  }
})()
