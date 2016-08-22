(function(){
    var app = angular.module('search-templates', ['github-faq-client', 'page-templates']);

    app.directive('searchTab', function(GithubFaqClient, TabTracker){
        return {
            restrict: 'E',
            templateUrl: '/site/search/search-tab.html',
            controller: function($log){
                this.docTab = 4;
                this.issueTab = 5;
                this.searchResults = [];
                this.issueResults = [];
                this.faqRepo = 'Integratingfactor/faq';
                this.issuesRepos = ['Integratingfactor/lib-idp-client', 'Integratingfactor/faq', 'Integratingfactor/integratingfactor.github.io'];
                this.searchTxt = null;
                var self = this;
                this.isActive = function() {
                    return self.isDocumentation() || self.isIssues();
                };
                this.isDocumentation = function() {
                    return this.docTab === TabTracker.getCurrTab();
                };
                this.isIssues = function() {
                    return this.issueTab === TabTracker.getCurrTab();
                };
                this.getSectionItems = function() {
                    return homeSectionItems;
                };
                this.search = function() {
                    if (!self.searchTxt) return;
                    if (self.isDocumentation()) {
                        // self.searchDocumentation();
                        self.searchCode();
                    } else {
                        self.searchIssues();
                    }
                };
                this.searchDocumentation = function() {
                    if (!self.searchTxt) return;
                    // GithubFaqClient.queryInIssues(self.searchTxt, self.faqRepo, function(data){
                    GithubFaqClient.queryInRepo(self.searchTxt, self.faqRepo, function(data){
                        $log.log("got search count", data.total_count,data);
                        if (data.total_count == 0) {
                            self.searchResults = [{question: "no match found"}]
                            return;
                        }
                        // clear out old search results
                        self.searchResults = [];
                        for (item in data.items) {
                            // $log.log("fetching FAQ item", data.items[item]);
                            var intro = data.items[item].text_matches[0].fragment;
                            GithubFaqClient.getFaqItem(data.items[item].git_url, function(data){
                                // $log.log("got FAQ item", data);
                                var decoded = JSON.parse(atob(data.content));
                                // decoded.intro = intro;
                                decoded.intro = "answer";
                                $log.log("decoded item is", decoded);
                                self.searchResults.push(decoded);
                            }, function(error){
                                $log.log("Failed to fetch FAQ item", error);
                            });
                        }
                    }, function(error){
                        $log.log("Failed to search", error);
                        self.searchResults = [];
                    });
                };

                this.searchCode = function() {
                    if (!self.searchTxt) return;
                    // GithubFaqClient.queryInIssues(self.searchTxt, self.faqRepo, function(data){
                    GithubFaqClient.queryInRepo(self.searchTxt, self.faqRepo, function(data){
                        // $log.log("got search count", data.total_count,data);
                        if (data.total_count == 0) {
                            self.searchResults = [{question: "no match found"}]
                            return;
                        }
                        // clear out old search results
                        self.searchResults = [];
                        for (item in data.items) {
                            var faq = data.items[item];
                            $log.log("using FAQ item", faq);
                            self.searchResults.push({question: faq.name,
                                url: faq.html_url,
                                intro: faq.text_matches[0].fragment});
                            // var intro = data.items[item].text_matches[0].fragment;
                            // GithubFaqClient.getFaqItem(data.items[item].git_url, function(data){
                            //     // $log.log("got FAQ item", data);
                            //     var decoded = JSON.parse(atob(data.content));
                            //     // decoded.intro = intro;
                            //     decoded.intro = "answer";
                            //     $log.log("decoded item is", decoded);
                            //     self.searchResults.push(decoded);
                            // }, function(error){
                            //     $log.log("Failed to fetch FAQ item", error);
                            // });
                        }
                    }, function(error){
                        $log.log("Failed to search", error);
                        self.searchResults = [];
                    });
                };

                function getNonNull(array, index) {
                    if (array instanceof Array && array[index]) {
                        return array[index];
                    } else {
                        return {state: null, body: null, html_url: null, text_matches: [{fragment: null}]};
                    }
                };

                this.searchIssues = function() {
                    if (!self.searchTxt) return;
                    self.issueResults = [];
                    for (repo in self.issuesRepos) {
                        // $log.log("searching in repo", repo);
                        GithubFaqClient.queryInIssues(self.searchTxt, self.issuesRepos[repo], function(data){
                        // GithubFaqClient.queryInRepo(self.searchTxt, self.faqRepo, function(data){
                            // $log.log("got search count", data.total_count,data);
                            // clear out old search results
                            for (item in data.items) {
                                self.issueResults.push( {question: getNonNull(data.items, item).title,
                                    url: getNonNull(data.items, item).html_url,
                                    status: getNonNull(data.items, item).state,
                                    number: getNonNull(data.items, item).number,
                                    intro: getNonNull(data.items,item).text_matches[0].fragment});
                            };
                    },function(error){
                        $log.log("Failed to search", error);
                        self.issueResults = [];
                    });
                };
                };
                this.issue2html = function(md){
                    var html = '<pre>';
                    var lines = md.split('\n');
                    for (line in lines) {
                        html = html.concat(lines[line]);
                    }
                    html = html.concat('</pre>');
                    return html;
                };
                this.searchTxt = "authentication";
                this.searchCode();
                this.searchTxt = null;
            },
            controllerAs: 'search'
        };
    });

    app.directive('searchTabSection', function(){
        return {
            restrict: 'E',
            templateUrl: '/site/search/search-tab-section.html'
        };
    });

    app.directive('issuesSearchTabSection', function(){
        return {
            restrict: 'E',
            templateUrl: '/site/search/issues-search-tab-section.html'
        };
    });

    app.filter("sanitize", ['$sce', function($sce) {
      return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
      }
    }]);

    app.filter("issue2html", ['$sce', function($sce) {
      return function(md){
        var html = '<pre>';
        var lines = md.split('\n');
        for (line in lines) {
            html = html.concat(lines[line]);
        }
        html = html.concat('</pre>');
        return html;
      }
    }]);

})();