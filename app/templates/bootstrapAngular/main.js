(function () {    
    require.config({
        baseUrl: "app",
        paths: {
          "angular": "https://ajax.googleapis.com/ajax/libs/angularjs/1.2.16/",
          "angularbootstrap" : "http://angular-ui.github.io/bootstrap/"
        },
        urlArgs: ""
    });

    require(
        [
            
            /*"angular/angular",
	        "angular/angular-route.min",
            "angular/angular-animate.min",*/
            
            //"app",
            
            "angularbootstrap/ui-bootstrap-0.11.0",
            "angularbootstrap/ui-bootstrap-tpls-0.11.0",
            
            
            /*"grid/grid",
            "services/dataService",
            "services/modalService",
            "controllers/deliveries/deliveryEditController",
            "controllers/deliveries/deliveriesController",
            "filters/nameAddressFilter"*/
        ],
        function () {
            angular.bootstrap(document, ["mapApp"]);
        });
}());

