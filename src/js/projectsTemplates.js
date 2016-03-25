(function(){
	var app = angular.module('projects-templates', ['idp-oauth-client','page-templates']);

    app.factory('IfProjects', function(IdpClient,IfStudioClient, $log){
        var ref = this;
        this.myProjects = [];
        return {
        	getAllProjects : function() {
        		return ref.myProjects;
        	},
            loadAllProjects : function(callback) {
                if(!IdpClient.isAuthorized('USER', 'devnet-alpha.integratingfactor.com')) {
                    return;
                };
                IfStudioClient.getAllProjects(function(data){
                    $log.log("loaded projects", data);
                    ref.myProjects = data;
                    callback();
                }, function(status){
                    $log.log("failed to get projects", status);
                    ref.myProjects = [];
                    if (ref.attempt <= 2) {
                        $log.log("reattempting");
                        ref.attempt += 1;
                        ref.loadAllProjects();
                    };
                    callback();
                });
            }
        };
    });

	app.directive('projectsTab', function(IfProjects, IdpClient,IfStudioClient, TabTracker){
		return {
			restrict: 'E',
			templateUrl: '/site/projects/projects-tab.html',
			controller: function($log){
		        var ref = this;
				this.myTab = 2;
				this.isActive = function() {
					return this.myTab === TabTracker.getCurrTab();
				};
		        this.myProjects = {};
		        this.currProject = {};
		        this.myApps = [];
		        this.currApp = {};
		        this.attempt = 0;
		        this.state = 'all'; // 'all' | 'update' | 'create'

		        this.currState = function(state) {
		        	return ref.state == state;
		        };

		        this.startNewProject = function() {
		        	ref.state = 'create';
		        	ref.currProject = {};
		        	ref.curr_roles = '';
		        };

		        this.removeProject = function(index) {
		        	$log.log("removing project", ref.myProjects[index].org_id);
		        	IfStudioClient.removeProject(ref.myProjects[index].org_id, function(data){
		        		$log.log("removed project", data);
			        	ref.reset();
		        	}, function(error){
		        		$log.log("Failed to removed project", error);
			        	ref.reset();
		        	});

		        }

		        this.startProjectUpdate = function(index) {
		        	ref.state = 'update';
		        	ref.currProject = {};
		        	ref.curr_roles = '';
		        	var orgId = ref.myProjects[index].org_id;
		        	ref.curr_org_id = orgId;
		        	$log.log("requesting project", orgId);
		        	IfStudioClient.getProjectDetails(orgId, function(data){
		        		$log.log("got project details", data);
		        		ref.currProject = data;
		        		if (data.org_roles && data.org_roles.length > 0) {
			        		ref.curr_roles = data.org_roles.toString();
		        		} else {
		        			ref.curr_roles = undefined;
		        		}
		        	}, function(error){
		        		$log.log("Failed to get project", error);
			        	ref.reset();
		        	});
		        };

		        this.submitProjectUpdate = function() {
		        	$log.log("submitting project update", ref.currProject);
		        	IfStudioClient.updateProject(ref.curr_org_id, ref.currProject, function(data){
		        		$log.log("updated project", data);
			        	ref.reset();
		        	}, function(error){
		        		$log.log("Failed to update project", error);
			        	ref.reset();
		        	});
		        };

		        this.submitNewProject = function() {
		        	$log.log("submitting new project", ref.currProject);
		        	IfStudioClient.registerProject(ref.currProject, function(data){
		        		$log.log("Created new project", data);
			        	ref.reset();
		        	}, function(error){
		        		$log.log("Failed to create project", error);
			        	ref.reset();
		        	});
		        };

		        this.reset = function() {
		        	ref.state = 'all';
		        	ref.currProject = {};
		        	ref.curr_roles = '';
		        	ref.attempt = 0;
		      		ref.myProjects = [];
		        	ref.loadAllProjects();
		        };

		        this.convertRoles = function() {
		        	ref.currProject.org_roles = ref.curr_roles.split(' ');
		        };

		        this.loadAllProjects = function() {
		        	if(!IdpClient.isAuthorized('USER', 'devnet-alpha.integratingfactor.com')) {
		        		return;
		        	};
		        	IfProjects.loadAllProjects(function() {
		        		ref.myProjects = IfProjects.getAllProjects();
		        	});
		        };

		        this.loadAllProjects();
			},
			controllerAs: 'projects'
		};
	});

	app.directive('projectsTabUser', function(){
		return {
			restrict: 'E',
			templateUrl: '/site/projects/projects-tab-user.html'
		};
	});

	app.directive('projectsTabAll', function(){
		return {
			restrict: 'E',
			templateUrl: '/site/projects/projects-tab-all.html'
		};
	});

	app.directive('projectsTabCreate', function(){
		return {
			restrict: 'E',
			templateUrl: '/site/projects/projects-tab-create.html'
		};
	});

	app.directive('projectsTabManage', function(){
		return {
			restrict: 'E',
			templateUrl: '/site/projects/projects-tab-manage.html'
		};
	});
})();