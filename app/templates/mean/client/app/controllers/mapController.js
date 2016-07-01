(function () {

    var MapController = function ($scope, dataService, modalService, $q) {
		
		var tilesDict = {
			openstreetmap: {
				url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
				options: {
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				}
			},
			opencyclemap: {
				url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
				options: {
					attribution: 'All maps &copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, map data &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> (<a href="http://www.openstreetmap.org/copyright">ODbL</a>'
				}
			},
			MapQuest: {
				url: 'http://{s}tile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
				options: {
					attribution: '&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a>'
				}
			}
		};
		
		//$scope.tiles= tilesDict.opencyclemap;
		
		$scope.layers= {
			baselayers:{
				googleTerrain: {
					name: 'Google Terrain',
					layerType: 'TERRAIN',
					type: 'google'
				},
				googleHybrid: {
					name: 'Google Hybrid',
					layerType: 'HYBRID',
					type: 'google'
				},
				googleRoadmap: {
					name: 'Google Streets',
					layerType: 'ROADMAP',
					type: 'google'
				}
			}
		};
			
		$scope.selectedElement=null;
		$scope.center= {
			lat: -34.378336878054010,
			lng: -55.238097391211330,
			zoom: 15
		};
		$scope.defaults= {
			scrollWheelZoom: false
		};
		$scope.markers= {
			/*Madrid: {
				lat: 40.095,
				lng: -3.823,
				message: "This is Madrid. But you can drag me to another position",
				focus: true,
				draggable: true
			},
			Barcelona: {
				lat: 41.38,
				lng: 2.18,
				message: "This is Barcelona. You can't drag me",
				focus: false,
				draggable: false
			}*/
		};
		
		//$scope.tiles=tilesDict.opencyclemap;
		

		$scope.events= {
			map: {
				enable: ['zoomstart', 'drag', 'click', 'mousemove', 'dragend', 'dragstart'],
				logic: 'emit'
			}
		};

		$scope.$on('leafletDirectiveMap.click', function(event, args){
			console.log(args.leafletEvent.latlng);
			$scope.selectedElement=null;
			$scope.markers.selectedPosition={
				lat: args.leafletEvent.latlng.lat,
				lng: args.leafletEvent.latlng.lng,
				message: "Nueva Posicion",
				focus: true,
				draggable: false/*,
				icon: {
					iconUrl: 'http://www.myiconfinder.com/uploads/iconsets/256-256-a5485b563efc4511e0cd8bd04ad0fe9e.png',
					iconSize:[32,32],
				}*/
			}
		});
		$scope.$on('leafletDirectiveMarker.click', function(e, args) {
			delete $scope.markers.selectedPosition;
			$scope.selectedElement=args.leafletEvent.target;
		});
		
		$scope.$on('leafletDirectiveMarker.dragend', function(e, args) {
			$scope.selectedElement=args.leafletEvent.target;
			var mapLocation=$scope.selectedElement.options.data;
			var name = mapLocation.name;

            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Mover Elemento',
                headerText: 'Mover ' + name + '?',
                bodyText: 'Esta seguro que desea mover este Elemento?'
            };
			modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.updateMapLocation(mapLocation.id, mapLocation.name, mapLocation.description, mapLocation.category_id, args.leafletEvent.target._latlng.lng, args.leafletEvent.target._latlng.lat, mapLocation.address, mapLocation.telephone, mapLocation.open_hours ).then($scope.refreshLocations);
                }else{
					$scope.selectedElement.setLatLng($scope.startDragCoords);
				}
				$scope.startDragCoords=null;
            });
			
		});
		
		$scope.startDragCoords={};
		$scope.$on('leafletDirectiveMarker.dragstart', function(e, args) {
			$scope.startDragCoords=args.leafletEvent.target._latlng;
		});

		$scope.addElement = function(){
			if($scope.markers.selectedPosition){
				var pos=$scope.markers.selectedPosition;
				delete $scope.markers.selectedPosition;
				var newEl={
					lat: pos.lat,
					lng: pos.lng,
					message: "Nueva Posicion",
					focus: false,
					draggable: true
				}
				$scope.markers[$scope.getNewElementId()]=newEl;
			}
		};
		$scope.getNewElementId=function(){
			var id=0;
			for(var i in $scope.markers){
				id++;
			}
			id++;
			return "element_"+id;
		}
		
		$scope.getSelectedElement=function(){
			var id=0;
			for(var i in $scope.markers){
				if($scope.markers[i].focus)
					return $scope.markers[i];
			}
			id++;
			return "element_"+id;
		}

		
		

        $scope.mapLocations = [];
        $scope.selected = null;
        $scope.categories=[];
        
        $scope.mapConfig={
            data:"mapLocations",
            selected:"selected"
        };
        
        $scope.openModal = function(title, row){
            
            
        };
        
        $scope.addMapElement=function(){
            $scope.openEditModal();
        }
        
        $scope.editMapElement=function(){
            $scope.openEditModal($scope.selectedElement.options.data);
        }
        
        $scope.removeMapElement=function(){
            
            var name = $scope.selectedElement.options.data.name;

            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Eliminar Elemento',
                headerText: 'Eliminar ' + name + '?',
                bodyText: 'Esta seguro que desea eliminar este Elemento?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteMapLocation($scope.selectedElement.options.data.id).then($scope.refreshLocations);
                }
            });
            
           
        }
        
        $scope.openEditModal=function(mapLocation){
            var name = "";
            if(mapLocation){
                name=mapLocation.name;
                mapLocation=angular.copy(mapLocation);
            }else{
                mapLocation={};
            }
            
            var modalOpts = {
                // backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: 'mapLocationEdit.html'
            };
            var _scope=this;
            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Aceptar',
                headerText: 'Editando ' + name,
                bodyText: '',
                mapLocation:mapLocation,
                categories:$scope.categories,
				selectedElement:$scope.selectedElement,
                openImagesModal:function(){
                    _scope.openImagesModal();
                }
            };

            modalService.showModal(modalOpts, modalOptions).then(function (result) {
                if (result === 'ok') {
                    var mapLocation=modalOptions.mapLocation;
                    if(name==""){
                        dataService.createMapLocation(mapLocation.name, mapLocation.description,mapLocation.category_id, $scope.markers.selectedPosition.lng, $scope.markers.selectedPosition.lat, mapLocation.address, mapLocation.telephone, mapLocation.open_hours ).then($scope.refreshLocations);
                    }else{
                        dataService.updateMapLocation(mapLocation.id, mapLocation.name, mapLocation.description, mapLocation.category_id, $scope.selectedElement._latlng.lng, $scope.selectedElement._latlng.lat, mapLocation.address, mapLocation.telephone, mapLocation.open_hours ).then($scope.refreshLocations);
                    }
                }
            });      
        };
        
        $scope.elementClicked=function(){
            //$scope.selected={coordinates:$scope.mapConfig.coordinatesClicked};
            //$scope.$digest();
        }
        
        $scope.refreshLocations=function(){
			dataService.getMapLocations().then(function(p) {
                
				var categories={};
				
				for(var i=0;i<$scope.categories.length;i++){
					categories[$scope.categories[i].id]=$scope.categories[i];
				}
				
				for(var l in $scope.markers){
					delete $scope.markers[l];
				}
				
				for(var i=0;i<p.mapLocations.length;i++){
					var marker={
						lat: parseFloat(p.mapLocations[i].lat),
						lng: parseFloat(p.mapLocations[i].lng),
						data:p.mapLocations[i],
						message: p.mapLocations[i].name,
						focus: false,
						draggable: true,
						icon:{
							iconUrl:((categories[p.mapLocations[i].category_id])?"images/map/"+categories[p.mapLocations[i].category_id].image:null),
							iconSize:[32, 37],
							iconAnchor:[16, 37],
							popupAnchor:[0, -28]
						}
					};
					
					$scope.markers[p.mapLocations[i].id]= marker; 
				}
            });
        }
		
		dataService.getCategories().then(function(p) {
            $scope.categories=p.categories;
			$scope.refreshLocations();
        
        });
		
        
        $scope.openImagesModal=function(){
            var name = $scope.selectedElement.options.data.name;
            var modalOpts = {
                // backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: 'mapLocationImages.html',
                width:"800px"
            };
            
            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Aceptar',
                headerText: 'Administracion de imagenes ' + name,
                bodyText: '',
                getImages:$scope.getImages,
                getImage:$scope.getImage,
                addImage:$scope.addImage,
                removeImage:$scope.removeImage
            };

            modalService.showModal(modalOpts, modalOptions).then(function (result) {
                if (result === 'ok') {
                    
                }
            });      
        };
        
        $scope.getImages = function() {
            var defer = $q.defer();
            dataService.getMapLocationImages($scope.selectedElement.options.data.id).then(function (results) {
                if(!results.error)
                    defer.resolve(results.images);
            });
            return defer.promise;
        };

        $scope.getImage = function(id) {
            var defer = $q.defer();
            dataService.getMapLocationImage(id).then(function (results) {
                if(!results.error)
                    defer.resolve(results.image);
            });
            return defer.promise;
        };

        $scope.addImage = function(image) {
            var defer = $q.defer();
            dataService.addMapLocationImage($scope.selectedElement.options.data.id, image).then(function (results) {
                if(!results.error)
                    defer.resolve(results.image_id);
            });
            return defer.promise;
        };

        $scope.removeImage = function(id) {
            var defer = $q.defer();

            var modalOptions = {
                closeButtonText: 'Cancelar',
                actionButtonText: 'Eliminar Imagen',
                headerText: 'Eliminar?',
                bodyText: 'Esta seguro que desea eliminar esta Imagen?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                if (result === 'ok') {
                    dataService.deleteMapLocationImage(id).then(function (results) {
                        if(!results.error)
                            defer.resolve(results);
                    });
                }
            });
            return defer.promise;

        };
        
        
    };

    MapController.$inject = ["$scope", "dataService", "modalService", "$q"];

    angular.module("mapApp").controller("MapController", MapController);

}());

