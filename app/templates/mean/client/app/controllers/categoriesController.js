(function () {

    var CategoriesController = function ($scope, $location, dataService, modalService) {

        $scope.categories = [];
    
        $scope.addressSearchText = null;
        $scope.nameSearchText = null;
        
        $scope.categoriesGridConfig={
            data:"categories",
            columns:[{name:"category",label:"Nombre", width:"30%", sortable:true, sortFunction:function(a,b) { return a.name<b.name; }},
                    {name:"description",label:"Descripcion", width:"50%"}, /*,
                    {name:"telephone",label:"Telefono", width:"30%",cellRenderer:function(row){ 
                        return row.telephone;
                    } },*/
                    {name:"name",label:"", width:"20%",cellRenderer:"<button type='button' class='btn btn-danger glyphicon glyphicon-remove-sign' style='margin-right:8px;height:30px' ng-click='delete(row)' title='Eliminar'></button><button type='button' class='btn btn-primary glyphicon glyphicon-pencil' style='margin-right:8px;height:30px' ng-click='editCategory(row)' title='Editar'></button>"}]
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
                $scope.refreshCategories();
            }
        };
        
        $scope.nextPage = function () {
            $scope.pageChanged($scope.currentPage+1);
        };
        
        $scope.lastPage = function () {
            $scope.pageChanged($scope.currentPage-1);
        };

        $scope.delete = function (category) {
            
            var name = category.category;

            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Eliminar Categoria',
                headerText: 'Eliminar ' + name + '?',
                bodyText: 'Esta seguro que desea eliminar esta Categoria?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteCategory(category.id);
                    $scope.refreshCategories();
                }
            });
        };
        
        $scope.addCategory=function(){
            $scope.openEditModal();
        };
        
        $scope.editCategory=function(category){
            $scope.openEditModal(category);
        };
        
        $scope.openEditModal=function(category){
            var name = "";
            if(category){
                name=category.category;
                category=angular.copy(category);
            }else{
                category={};
            }
            
            var modalOpts = {
                // backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: 'categoryEdit.html'
            };
            
            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Aceptar',
                headerText: 'Editando ' + name,
                bodyText: '',
                category:category,
				categoryImages:[]
            };
			
			dataService.getCategoryImages().then(function(ret){
				modalOptions.categoryImages=ret;
				
				modalService.showModal(modalOpts, modalOptions).then(function (result) {
                if (result === 'ok') {
                    if(name==""){
                        dataService.createCategory(modalOptions.category.category, modalOptions.category.description, modalOptions.category.image).then($scope.refreshCategories);
                    }else{
                        dataService.updateCategory(modalOptions.category.id, modalOptions.category.category, modalOptions.category.description, modalOptions.category.image).then($scope.refreshCategories());
                    }
                }
            });      
				
			})

            
        };
            

        $scope.navigate = function (url) {
            $location.path(url);
        };

        $scope.refreshCategories = function(){
            dataService.getCategories().then(function(p) {
                //$scope.updateCategories();
                $scope.categories=p.categories;
            });
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
        
        

        function init() {
            $scope.refreshCategories();
        }
            
        init();
    };

    CategoriesController.$inject = ['$scope', '$location', 'dataService', 'modalService'];

    angular.module('mapApp').controller('CategoriesController', CategoriesController);

}());
