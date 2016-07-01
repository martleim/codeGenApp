(function () {

    var EntitiesController = function ($scope, $location, $filter, dataService, modalService) {

        
        $scope.model = {entities:[]};
        $scope.unFilteredEntities = [];
        $scope.modelStringInput="";
        
        Object.defineProperty($scope, "modelString", { 
            get : function(){ 
                return JSON.stringify($scope.model);
            },
            set : function(newValue){ 
                $scope.model = JSON.parse(newValue);    
            } 
        });
        
        $scope.nameSearchText = null;
        
        $scope.entitiesGridConfig={
            data:"model.entities",
            columns:[{name:"name",label:"Nombre", width:"70%", sortable:true, sortFunction:function(a,b) { return a.name<b.name; }},
                    /*{name:"address",label:"Direccion", width:"30%"},
                    {name:"telephone",label:"Telefono", width:"30%",cellRenderer:function(row){ 
                        return row.telephone;
                    } },*/
                    {name:"name",label:"", width:"30%",cellRenderer:"<button type='button' class='btn btn-danger glyphicon glyphicon-remove-sign' style='margin-right:8px;height:30px' ng-click='delete(row)'></button><button type='button' class='btn btn-primary glyphicon glyphicon-pencil' style='margin-right:8px;height:30px' ng-click='editEntity(row)'></button>"}
                    ]
        };
		

        //paging
        $scope.totalRecords = 0;
        $scope.pageSize = 10;
        $scope.currentPage = 1;
        $scope.navigatablePages=[];
        $scope.totalShownPages=6;
        $scope.totalPages=0;

        $scope.pageChanged = function (page) {
            if(page>=1 && page<=$scope.totalPages){
                $scope.currentPage = page;
                $scope.updateEntities();
            }
        };
        
        $scope.nextPage = function () {
            $scope.pageChanged($scope.currentPage+1);
        };
        
        $scope.lastPage = function () {
            $scope.pageChanged($scope.currentPage-1);
        };

        $scope.delete = function (entity) {
            
            var name = entity.name;

            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Eliminar Entidad',
                headerText: 'Eliminar ' + name + '?',
                bodyText: 'Esta seguro que desea eliminar esta Entidad?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteEntity(name);
                    $scope.updateEntities();
                }
            });
        };
        
        $scope.editEntity=function(entity){
            $location.path("/entityedit/"+entity.name);
        };

        $scope.navigate = function (url) {
            $location.path(url);
        };


        $scope.updateEntities = function(){
            $scope.model=dataService.getModel();
            /*var res=dataService.getEntities(this.currentPage,this.pageSize);
            $scope.entities=res.results;
            $scope.unFilteredEntities=$scope.entities;
            
            $scope.totalRecords=res.totalRecords;
            $scope.setNavigatablePages();*/
        }
        
        $scope.setNavigatablePages = function(){
            $scope.totalPages=Math.ceil(this.totalRecords/this.pageSize)-1;
            var start=this.currentPage-($scope.totalShownPages/2);
            start=(start<1)?1:start;
            var end=start+($scope.totalShownPages-1);
            if(end>$scope.totalPages){
                start-=(end-$scope.totalPages);
            }
            var pages=[];
            for(var i=0;i<$scope.totalShownPages;i++){
                pages.push(start+i);
            }
            $scope.navigatablePages=pages;
        }
        
        

        $scope.filterEntities=function(name) {
            var filteredEntities = $filter("nameFilter")($scope.unFilteredEntities, name);
            $scope.entities=filteredEntities;
            
        }
        
        $scope.importModel=function(){
            $scope.modelString=$scope.modelStringInput;
            dataService.setModel($scope.model);
        }
		
		$scope.saveModel=function(){
			window.saveModel($scope.entities);
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
            //dataService.initialize().then(function(p) {
                $scope.updateEntities();
            //});
			SI.Files.stylizeAll();
        }
            
        init();
    };

    EntitiesController.$inject = ['$scope', '$location', '$filter', 'dataService', 'modalService'];

    angular.module('codeGenApp').controller('EntitiesController', EntitiesController);

}());
