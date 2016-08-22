(function(){
	var app = angular.module('idp-oauth-client', []);
	app.factory('IdpClient', function($log, $window, $http, $httpParamSerializerJQLike){
		var clientId='b80a9eb3-8b8e-46ef-ad61-77309f9bedb4';		
		var idpHost='https://if-idp.appspot.com';		
		var clientSecret='';
		var clientAuth=btoa(clientId+':'+clientSecret);
		var errorPage;
		var redirectUrl=$window.location.protocol + '//' + $window.location.host;
		var userInfo;
		var token;
		var isSessionStorageSupported = false;
		try {
			$window.sessionStorage.test = 1;
			isSessionStorageSupported = true;
			var temp = $window.sessionStorage.userInfo;
			if (temp && typeof temp != "undefined" && temp != "null") {
				userInfo = JSON.parse(temp);
				token = JSON.parse($window.sessionStorage.token);
				$log.log('user info retreived from session storage');
			} else {
				$log.log('user info not found in session storage');
				$window.sessionStorage.userInfo = JSON.stringify(userInfo);
				$window.sessionStorage.token = JSON.stringify(token);
			}
		} catch (e) {
			$log.log('session storage not supported', e);
		};

		function requestAccessToken(clientId,type){
			$log.log("requesting access token");
			$window.location=idpHost+'/oauth/authorize?client_id='+clientId+'&response_type='+type+'&redirect_uri='+redirectUrl;
		}

		function validateToken(accessToken, returnTo) {
			$log.log("validating access token");
			if (accessToken && typeof accessToken != "undefined" && accessToken != "null") {
			  $http({
			    url:idpHost+'/oauth/check_token',
			    method: "POST",
			    headers: {
			      Authorization: "Basic " + clientAuth,
			      'Content-Type': 'application/x-www-form-urlencoded'
			    },
			    data: $httpParamSerializerJQLike({
			      token: accessToken
			    })
			  })
			  .success(function (data) {
			    $log.log("validated token successfully");
			    userInfo=data;
			    token=accessToken;
				if (isSessionStorageSupported) {
					$window.sessionStorage.userInfo = JSON.stringify(userInfo);
					$window.sessionStorage.token = JSON.stringify(token);
				}
				returnTo();
			  })
			  .error(function (req, status, error) {
			    $log.log("Failed to validate token: ", status, error);
			    userInfo=null;
			    token=null;
				if (isSessionStorageSupported) {
					$window.sessionStorage.userInfo = JSON.stringify(userInfo);
					$window.sessionStorage.token = JSON.stringify(token);
				}
			  });
			}
		}

		function checkTokenGrant(returnTo) {
			$log.log("checking access token in location hash");
			// First, parse the query string
			var params = {}, queryString = $window.location.hash.substring(1),
			    regex = /([^&=]+)=([^&]*)/g, m;
			while (m = regex.exec(queryString)) {
			  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
			}
			$window.location.hash='';

			// Verify that we have a token grant
			if (params['/access_token']) {
			  // remove hash fragments from location
			  $log.log("found access_token in hash, validating it");
			  validateToken(params['/access_token'], returnTo);
			} else if (params['error']){
			  $log.log("Token authorization failed: ", params['error_description']);
			}
		}


		return {
			// call this method at the startup/page load to initialize
			idpInitialize: function(returnTo) {
				$log.log('idp library initializing');
				checkTokenGrant(returnTo);
			},
			// get current access token, e.g., to talk to backend service
			getToken: function() {
				if (this.isAuthenticated()) {
					return token;					
				} else {
					return null;
				}
			},
			// get current authenticated user
			getUser: function() {
				if (this.isAuthenticated()) {
					return {
						firstName: userInfo['given_name'],
						lastName: userInfo['family_name'],
						roles: userInfo['org_roles'],
						org: userInfo['org_id']
					};					
				} else {
					return null;
				}
			},
			// intiate a login explicitly
			idpLogin: function(onSuccess) {
				$log.log('idp login called');
				if (!this.isAuthenticated()) {
				  $log.log("User is not authenticated");
				  requestAccessToken(clientId, 'token', 'http://'+$window.location.hostname+$window.location.pathname);
				} else {
				  $log.log("User is already authenticated");
				  onSuccess();
				}
			},
			// initiate a logout explicitly
			idpLogout: function() {
				$log.log("logging out user");
			    userInfo=null;
				if (isSessionStorageSupported) {
					$window.sessionStorage.userInfo = JSON.stringify(userInfo);
				}
			    token=null;
			},
			// check if user is authenticated and token is not expired
			isAuthenticated: function () {
				return userInfo && userInfo.exp * 1000 > Date.now();
			},
			// check if user is authorized with specified role for the org
			isAuthorized: function(role, org) {
				if (!this.isAuthenticated()) {
					return false;
				}
				return (!role || $.inArray(role, userInfo['org_roles']) !== -1) && (!org || org == userInfo['org_id']);
			}
		};
	});
})();