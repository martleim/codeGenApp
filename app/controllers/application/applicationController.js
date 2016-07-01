(function () {

    var ApplicationController = function ($scope, $location, $filter, dataService, modalService) {

        $scope.appName = "AppTest";
		$scope.appTitle = "App Test";
		$scope.model={};

		$scope.updateModel=function(){
			return dataService.getModel();
		}

        //paging


        function init() {
            //dataService.initialize().then(function(p) {
                $scope.model=$scope.updateModel();
				
				$scope.appName = $scope.model.appName||"AppTest";
				$scope.appTitle = $scope.model.appTitle||"App Test";
				
            //});
			SI.Files.stylizeAll();
        }
            
        init();
    };

    ApplicationController.$inject = ['$scope', '$location', '$filter', 'dataService', 'modalService'];

    angular.module('codeGenApp').controller('ApplicationController', ApplicationController);

}());
