(function () {

    var dataService = function (entitiesService) {
        return entitiesService;
    };

    dataService.$inject = ['entitiesService'];

    angular.module('codeGenApp').factory('dataService', dataService);

}());

