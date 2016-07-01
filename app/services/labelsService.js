(function () {

    var labelsService = function ($http) {
        var labelModelUrl = "app/labels/labels.json",
            factory = {};
			
		factory.labelModel={};
        
        factory.labelSet={};
        
        factory.loadLabelModel = function () {
            return $http.get(labelModelUrl).then(function (results) {
                scope.labelModel = results.data;
            });
        };
        
        factory.selectLabelSet=function(setId){
            angular.forEach(function(set){
                if(set.id==setId)
                    this.labelSet=set;
                
            },this);
        };
        
        factory.getLabel=function(labelId){
            return this.labelSet[labelId];
        }
                
        factory.initialize = function(){
            factory.loadLabelModel();
        }
		

        return factory;
    };

    labelsService.$inject = ["$http"];

    angular.module("codeGenApp").factory("labelsService", labelsService);

}());