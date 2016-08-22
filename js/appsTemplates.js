(function(){
	var app = angular.module('apps-templates', ['page-templates', 'api-docs-templates']);

	app.directive('appsTab', function(IdpClient, TabTracker){
		return {
			restrict: 'E',
			templateUrl: '/site/apps/apps-tab.html',
			controller: function($log){
				this.myTab = 3;
				this.isActive = function() {
					return this.myTab === TabTracker.getCurrTab();
				};
			},
			controllerAs: 'apps'
		};
	});

	app.directive('appsTabUser', function(IdpClient){
		return {
			restrict: 'E',
			templateUrl: '/site/apps/apps-tab-user.html'
		};
	});
})();