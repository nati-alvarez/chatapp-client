var app = angular.module("app", ["ngRoute", "luegg.directives"]);

app.config(function($routeProvider){
    $routeProvider
    .when("/",{
        templateUrl: "views/home.html",
        controller: "homeController"
    })
    .when("/dashboard", {
        templateUrl: "views/dashboard.html",
        controller: "dashboardController"
    });
});