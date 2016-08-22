(function(){
	var app = angular.module('page-templates', ['Core']);

	app.factory('TabTracker', function($window, $log){
		var currTab = 1;
		var isSessionStorageSupported = false;
		try {
			$window.sessionStorage.test = 1;
			isSessionStorageSupported = true;
			var temp = parseInt($window.sessionStorage.currTab);
			if (temp && typeof temp != "undefined" && temp != "null") {
				currTab = temp;
			} else {
				$window.sessionStorage.currTab = currTab;					
			}
		} catch (e) {
			$log.log('session storage not supported');
		};
		return {
			getCurrTab: function() {
				return currTab;
			},
			setCurrTab: function(setTo) {
				currTab = setTo;
				if (isSessionStorageSupported) {
					$window.sessionStorage.currTab = currTab;
				}
			}
		};
	});

	app.directive('pageHeader', function(TabTracker){
		return {
			restrict: 'E',
			templateUrl: '/site/common/page-header.html',
			controller: function($log){
				this.isSet = function(checkTab) {
					return TabTracker.getCurrTab() === checkTab;
				};

				this.setTab = function(setTab) {
					TabTracker.setCurrTab(setTab);
				};

			},
			controllerAs: 'headers'
		};
	});


	app.directive('pageFooter', function(){
		return {
			restrict: 'E',
			templateUrl: '/site/common/page-footer.html'
		};
	});
})();