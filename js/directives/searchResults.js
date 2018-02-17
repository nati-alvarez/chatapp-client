app.directive("searchResults", function(){
    return {
        restrict: "E",
        templateUrl: "js/directives/templates/searchResults.html",
        scope: {
            users: "="
        }
    }
})