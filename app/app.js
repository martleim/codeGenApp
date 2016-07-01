(function () {

    var app = angular.module("codeGenApp",["ngRoute","ml-grid","ui.bootstrap"]);

    app.config(["$routeProvider", function ($routeProvider) {
        //var viewBase = "/app/views/";
		var viewBase = "app/views/";

        $routeProvider
			.when("/application", {
                controller: "ApplicationController",
                templateUrl: viewBase + "application/application.html"
            })
			.when("/entities", {
                controller: "EntitiesController",
                templateUrl: viewBase + "entities/entities.html"
            })
			.when("/entityedit/:entityName", {
                controller: "EntityEditController",
                templateUrl: viewBase + "entities/entityEdit.html"
            })
            .when("/entityadd", {
                controller: "EntityEditController",
                templateUrl: viewBase + "entities/entityEdit.html"
            })
            .when("/generator", {
                controller: "GeneratorController",
                templateUrl: viewBase + "generator/generator.html"
            })
            .otherwise({ redirectTo: "/entities" });

    }]);

    app.run();

}());

