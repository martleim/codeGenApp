(function () {

    var EntityEditController = function ($rootScope, $scope, $location, $routeParams, $timeout, dataService, modalService) {

        var entityName = ($routeParams.entityName) ? $routeParams.entityName : "",
            timer,
            onRouteChangeOff;
        //var EntitiesController=EntitiesController;    
    
        $scope.entity={attributes:[]};
        $scope.states = [];
        $scope.edit=(entityName && entityName!="");
        $scope.title = ($scope.edit) ? "Editar" : "Agregar";
        $scope.buttonText = ($scope.edit) ? "Guardar" : "Agregar";
        $scope.updateStatus = false;
        $scope.errorMessage = "";
        $scope.sameAsAdministrative = false;
        
        $scope.types=Types.dataTypes;
        $scope.keyTypes=Types.keyTypes;
        $scope.entities=dataService.getEntities();
    
        $scope.attributesGridConfig={
            data:"entity.attributes",
            columns:[
                {name:"name",label:"Nombre", width:"30%", sortable:true, sortFunction:function(a,b) { return a.name<b.name; },cellRenderer:"<input required data-ng-model='row.name'></input>"},
                {name:"type",label:"Tipo", width:"20%",cellRenderer:"<select data-ng-model='row.type' ng-options='type.name as type.name for type in types'></select>"},
                {name:"length",label:"Largo", width:"10%",cellRenderer:"<input data-ng-model='row.length' type='numeric'></input>"},
                //{name:"key",label:"Clave", width:"10%",cellRenderer:"<input type='checkbox' data-ng-model='row.key'></input>"},
                {name:"key",label:"Clave", width:"10%",cellRenderer:"<select data-ng-model='row.key' ng-options='keyType.name as keyType.name for keyType in keyTypes'></select>"},
                {name:"auto",label:"Auto", width:"10%",cellRenderer:"<input type='checkbox' data-ng-model='row.auto'></input>"},
                {name:"required",label:"Requerido", width:"10%",cellRenderer:"<input type='checkbox' data-ng-model='row.required'></input>"},
                {name:"visible",label:"Visible", width:"10%",cellRenderer:"<input type='checkbox' data-ng-model='row.visible'></input>"},
                {name:"references",label:"Referencia", width:"20%",cellRenderer:"<select data-ng-model='row.references' ng-options='entity.name as entity.name for entity in entities'></select>"},
                {name:"remove",label:"", width:"10%",cellRenderer:"<button type='button' class='btn btn-danger glyphicon glyphicon-remove-sign' style='margin-right:8px;height:30px' ng-click='deleteAttribute(row)'></button>"}
            ]
        };
        

        init();

        $scope.save = function () {
            if ($scope.editForm.$valid) {
                var entityToSave = angular.copy($scope.entity);
                if (!this.edit) {
                    dataService.insertEntity(entityToSave);
                }
                else {
                    dataService.updateEntity(entityName,entityToSave);
                }
                processSuccess();
            }
        };

        $scope.delete = function () {
            var name = $scope.entity.name;

            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Eliminar Entity',
                headerText: 'Eliminar ' + name + '?',
                bodyText: 'Esta seguro que desea eliminar este Entity?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteEntity(name);
                    $scope.updateEntities();
                }
            });
        };
        
        $scope.addNewAttribute=function(){
            $scope.entity.attributes.push({});
        }
        
        $scope.deleteAttribute=function(row){
        
        }
        
        function init() {
            if (entityName != "") {
                $scope.entity = angular.copy(dataService.getEntity(entityName));
            }
            onRouteChangeOff = $rootScope.$on('$locationChangeStart', routeChange);
        }
        
        $scope.navigate = function (url) {
            $location.path(url);
        };

        function routeChange(event, newUrl) {
            //Navigate to newUrl if the form isn"t dirty
            if (!$scope.editForm.$dirty) return;

            var modalOptions = {
                closeButtonText: "Cancelar",
                actionButtonText: "Ignorar Cambios",
                headerText: "Cambios sin guardar",
                bodyText: "Tiene cambios sin guardar. Quiere abandonar la pagina?"
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === "ok") {
                    onRouteChangeOff(); //Stop listening for location changes
                    $location.path(newUrl); //Go to page they"re interested in
                }
            });

            //prevent navigation by default since we"ll handle it
            //once the user selects a dialog option
            event.preventDefault();
            return;
        }

        function processSuccess() {
            $scope.editForm.$dirty = false;
            $scope.updateStatus = true;
            $scope.title = "Editar";
            $scope.buttonText = "Guardar";
            $scope.edit=true;
            startTimer();
        }

        function startTimer() {
            timer = $timeout(function () {
                $timeout.cancel(timer);
                $scope.errorMessage = '';
                $scope.updateStatus = false;
                $scope.navigate('/entities');
            }, 1000);
        }

    };

    EntityEditController.$inject = ["$rootScope", "$scope", "$location", "$routeParams",
                                      "$timeout", "dataService", "modalService"];

    angular.module("codeGenApp").controller("EntityEditController", EntityEditController);

}());