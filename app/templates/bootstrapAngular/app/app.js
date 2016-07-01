(function () {
    
    var app = angular.module("mapApp",["ngRoute","ngAnimate","app-grid","app-map","app-pieChart","ui.bootstrap"]);

    app.config(["$routeProvider", function ($routeProvider) {
		var viewBase = "app/views/";

        $routeProvider
			.when("/categories", {
                controller: "CategoriesController",
                templateUrl: viewBase + "categories/categories.html"
            })
            .when("/map", {
                controller: "MapController",
                templateUrl: viewBase + "map/map.html"
            })
			.when("/about", {
                controller: "AboutController",
                templateUrl: viewBase + "about/about.html"
            })
            .otherwise({ redirectTo: "/categories" });

    }]);

    app.run();

}());

