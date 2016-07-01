(function () {

    var entitiesService = function ($http) {
        var modelUrl = "app/services/entities.json",
            factory = {};
			
		factory.appModel={
			appName:"appName",
			appTitle:"App Title",
			entities:[]
		};
        
        factory.getEntities = function (pageIndex, pageSize) {
            //return this.getPagedEntities(pageIndex, pageSize);
            return factory.appModel.entities;
        };
        
        factory.insertEntity = function (entity) {
            factory.appModel.entities.push(entity);
        };

        factory.updateEntity = function (oldName,entity) {
            for(var i=0;i<this.appModel.entities.length;i++){
                if(oldName==this.appModel.entities[i].name)
                    return this.appModel.entities[i]=entity;
            }
        };

        factory.deleteEntity = function (name) {
            for(var i=0;i<this.appModel.entities.length;i++){
                if(name==this.appModel.entities[i].name)
                    return this.appModel.entities.splice(i,1);
            }
        };

        factory.getEntity = function (name) {
            for(var i=0;i<this.appModel.entities.length;i++){
                if(name==this.appModel.entities[i].name)
                    return this.appModel.entities[i];
            }
        };
        
        factory.initialize = function(){
            var scope = this;
            return $http.get(modelUrl).then(function (results) {
                if(scope.appModel.entities.length==0){
					scope.appModel=results.data;
					scope.entities=scope.appModel.entities;
                    //scope.entities = results.data;
                }
                return scope.appModel;
            });
                       
        }
        
        factory.setModel=function(model){
            factory.appModel=model;
        }
		
		factory.setEntities=function(model){
            factory.appModel.entities=model;
        }
		
		factory.getModel=function(){
            return factory.appModel;
        }
		
		factory.getPagedEntities = function(pageIndex, pageSize) {
            var entities=(this.filteredEntities&&this.filteredEntities.length>0)?this.filteredEntities:this.entities;
            return { totalRecords:entities.length , results:entities.slice((pageIndex * pageSize), ((pageIndex+1) * pageSize)) }
        }

        return factory;
    };

    entitiesService.$inject = ["$http"];

    angular.module("codeGenApp").factory("entitiesService", entitiesService);

}());