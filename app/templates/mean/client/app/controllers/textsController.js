(function () {

    var TextsController = function ($scope, $location, $q, dataService, modalService) {

        $scope.texts = [];
    
        $scope.addressSearchText = null;
        $scope.nameSearchText = null;
        
        $scope.textsGridConfig={
            data:"texts",
            columns:[{name:"textCode",label:"Codigo", width:"20%", sortable:true, sortFunction:function(a,b) { return a.textCode<b.textCode; }},
					 {name:"lang_0",label:"Ingles", width:"25%", sortable:true, sortFunction:function(a,b) { return a.lang_0<b.lang_0; }},
					 {name:"lang_1",label:"Español", width:"25%", sortable:true, sortFunction:function(a,b) { return a.lang_1<b.lang_1; }},
					 {name:"lang_2",label:"Portugues", width:"25%", sortable:true, sortFunction:function(a,b) { return a.lang_2<b.lang_2; }},
                    {name:"name",label:"", width:"5%",cellRenderer:"<button type='button' class='btn btn-primary glyphicon glyphicon-pencil' style='margin-right:8px;height:30px' ng-click='editText(row)' title='Editar'></button>"}]
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
                $scope.refreshTexts();
            }
        };
        
        $scope.nextPage = function () {
            $scope.pageChanged($scope.currentPage+1);
        };
        
        $scope.lastPage = function () {
            $scope.pageChanged($scope.currentPage-1);
        };
        
        $scope.editText=function(text){
            $scope.openEditModal(text);
        };
		
 		$scope.openEditModal=function(selected){
            var name =selected.textCode;
            text=angular.copy(selected);

			var modalOpts = {
                // backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: 'textEdit.html'
            };
            
			text.currentEdit=text["lang_1"];
            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Aceptar',
                headerText: 'Editando ' + name,
                bodyText: '',
                text:text, 
				currentEdit:text["lang_1"],
				currentIndex:1
            };
			
			$scope.modalOptions=modalOptions;
			
			$scope.$watch('modalOptions.text.currentEdit',function(n,o){
				if(n!=o)
					$scope.modalOptions.text["lang_"+$scope.modalOptions.currentIndex]=n;
			});
			
			modalOptions.setCurrentEdit=function(i){
				//modalOptions.updateBeforeChange();
				$scope.modalOptions.currentIndex=i;
				this.text.currentEdit=this.text["lang_"+$scope.modalOptions.currentIndex];
			}
			
			modalOptions.updateBeforeChange=function(){
				//this.text["lang_"+this.currentIndex]=this.text.currentEdit;
			}
			
			
			/*
			modalOptions.setCurrentEdit=function(v){
				//this._currentEdit=v;
				if(this.text["lang_"+v])
					this.currentEdit=this["lang_"+v];
				
			}
			Object.defineProperty(modalOptions,"currentEdit",{
				get:function(){
					return this.text["lang_"+this._currentEdit];
				}, 
				set:function(v){
					if(this.text["lang_"+v])
						this._currentEdit=v;
				} 
			})*/
			

            modalService.showModal(modalOpts, modalOptions).then(function (result) {
                if (result === 'ok') {
					modalOptions.updateBeforeChange();
					var promises=[];
					for(var i in selected){
						if(i.indexOf("_")>0 && selected[i]!=modalOptions.text[i]){
							promises.push(dataService.updateHotelText(i.split("_")[1],selected.textCode, modalOptions.text[i]  ));
						}
					}
					$q.all(promises).then($scope.refreshTexts());
                }
            });      
        };
            

        $scope.navigate = function (url) {
            $location.path(url);
        };

        $scope.refreshTexts = function(){
            dataService.getHotelTexts().then(function(p) {
                //$scope.updateTexts();
				var texts={};
				var textsArr=[];
				for(var i in p.texts){
					var lang=p.texts[i];
					for(var t in lang){
						if(!texts[t]){
							texts[t]={textCode:t};
						}
						texts[t][i]=lang[t];
					}
				}
				for(var t in texts){
					textsArr.push(texts[t]);
				}
                $scope.texts=textsArr;
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
            $scope.refreshTexts();
        }
            
        init();
    };

    TextsController.$inject = ['$scope', '$location', '$q', 'dataService', 'modalService'];

    angular.module('mapApp').controller('TextsController', TextsController);

}());
