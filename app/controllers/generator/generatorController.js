(function () {

    var GeneratorController = function ($scope, $location, $http, dataService, modalService,templateGeneratorService,fileService) {

        /*window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
        var fileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;*/
        
        $scope.templates = [];
        $scope.model = {};

        $scope.TemplateGenerator=templateGeneratorService;
		$scope.FileService=fileService;
        
        $scope.model=dataService.getModel();
		$scope.entities=$scope.model.entities;
		$scope.appName = $scope.model.appName||"AppTest";
		$scope.appTitle = $scope.model.appTitle||"App Test";
        
        $scope.templatesGridConfig={
            data:"templates",
            columns:[{name:"name",label:"Nombre", width:"70%", sortable:true, sortFunction:function(a,b) { return a.name<b.name; }},
                    {name:"name",label:"", width:"30%",cellRenderer:"<button type='button' class='btn btn-primary glyphicon glyphicon-download' style='margin-right:8px;height:30px' ng-click='generate(row)'></button>"}
                    ]
        };
        
        
        $scope.generate=function(template){
            var _template=template;
			var _fileService=fileService;
            var generated=template.generate($scope.model).then(function(e){
                var u=_template.generated;
				$scope.FileService.saveGenerated(JSON.stringify($scope.entities),u);
                /*for(var i in u){
                    console.log("\n"+i+"\n");
                    console.log(u[i]);
                }*/
            });
        }
        
        $scope.TemplateGenerator.loadTemplatesLoaders().then(function(){
            //$scope.TemplateGenerator.generate("sql",$scope.entities);
            $scope.templates=$scope.TemplateGenerator.templates;
        });
        
		
    };

    GeneratorController.$inject = ['$scope', '$location', '$http', 'dataService', 'modalService','templateGeneratorService','fileService'];

    angular.module('codeGenApp').controller('GeneratorController', GeneratorController);

}());
