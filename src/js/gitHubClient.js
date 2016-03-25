(function(){
    var app = angular.module('github-faq-client', []);
    app.factory('GithubFaqClient', function($log, $http, $httpParamSerializerJQLike){
        var apiBase='https://api.github.com/search/';
        var codeQuery='code?q=';
        var issuesQuery='issues?q=';
        var queryInRepo='+repo:';
        function httpReq(method, url, body, onSuccess, onError) {
              // $log.log("using access token:" + IdpClient.getToken());
              $http({
                url: url,
                method: method,
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/vnd.github.v3.text-match+json'
                },
                data: body
              })
              .success(function (data) {
                onSuccess(data);
              })
              .error(function (req, status, error) {
                onError(status);
              });
        };
        return {
            queryInRepo: function(search, repo, onSuccess, onError) {
                $log.log("searching for", search, "in code of", repo);
                httpReq('GET', apiBase + codeQuery + search + queryInRepo + repo, null, onSuccess, onError);
            },
            queryInIssues: function(search, repo, onSuccess, onError) {
                $log.log("searching for", search, "in issues of", repo);
                httpReq('GET', apiBase + issuesQuery + search + queryInRepo + repo, null, onSuccess, onError);
            },
            getFaqItem: function(git_url, onSuccess, onError) {
                $log.log("getting faq item", git_url);
                httpReq('GET', git_url, null, onSuccess, onError);
            },
            getIssueComments: function(comments_url, issue, onSuccess, onError) {
                $log.log("getting faq item", comments_url);
                httpReq('GET', comments_url, null, function(data) {
                  if (data.length == 0) {
                    data = [{body: 'no comments'}];
                  }
                  onSuccess(issue, data);
                }, function(error) {
                  onError(issue, error);
                });
            }
        };
    });
})();