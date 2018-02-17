app.directive("friendRequest", function(){
    return {
        restrict: "E",
        templateUrl: "js/directives/templates/friendRequest.html",
        scope: {
            request: "="
        }
    }

});