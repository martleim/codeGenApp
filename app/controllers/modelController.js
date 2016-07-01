(function () {

    var ModelController = function ($scope, $location, $filter, dataService, modalService) {

	
		$scope.model = {entities:[]};
        $scope.modelStringInput="";
        
        Object.defineProperty($scope, "modelString", { 
            get : function(){ 
                return JSON.stringify($scope.model);
            },
            set : function(newValue){ 
                $scope.model = JSON.parse(newValue);    
            } 
        });
	
        $scope.importModel=function(){
            $scope.modelString=$scope.modelStringInput;
            dataService.setModel($scope.model);
        }
		
		$scope.saveModel=function(){
			window.saveModel(dataService.getModel());
		}
		
		$scope.loadModel=function(){
			window.loadModel($scope.entities);
		}
		
		$scope.loadModelClick=function(){
			var _scope=$scope;
			var _dataService=dataService;
			document.getElementById("loadModelClick").addEventListener("change",function(e){
				var fr = new FileReader();
				var files=e.target.files;
				if(files.length==1){
					var f=files[0];
					var fr = new FileReader();    
					fr.fileLoadingName=f.name;
					fr.onload = function(e) {
						_scope.modelString=e.target.result;
						_dataService.setModel($scope.model);
					}
					fr.readAsText(f);
				}
			});
		}

        function init() {
			SI.Files.stylizeAll();
        }
            
        init();
    };

    ModelController.$inject = ['$scope', '$location', '$filter', 'dataService', 'modalService'];

    angular.module('codeGenApp').controller('ModelController', ModelController);

}());
