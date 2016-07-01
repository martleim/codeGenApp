(function () {

    var dataService = function ($http) {
        var baseUrl = UrlConfig.baseUrl,
        categoriesUrl = UrlConfig.categoriesUrl,
        mapLocationsUrl = UrlConfig.mapLocations,
        loginUrl = UrlConfig.loginUrl,
        authKey = null,
        factory = {};
			
		factory.model=[];
		
		factory.formatRequest=function(data, getHeaders){
			var headers = getHeaders();
			headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";
			
			if ( ! angular.isObject( data ) ) {
				return( ( data == null ) ? "" : data.toString() );
			}

			var buffer = [];
			for ( var name in data ) {
				if ( ! data.hasOwnProperty( name ) ) {
					continue;
				}
				var value = data[ name ];
				buffer.push( encodeURIComponent( name ) +"=" +encodeURIComponent( ( value == null ) ? "" : value ) );
			}

			var source = buffer.join( "&" ).replace( /%20/g, "+" );

			return( source );
		}
        
        factory.login = function (email, password) {
			$http.defaults.transformRequest=this.formatRequest;
			return $http.post(baseUrl+loginUrl,{email:email, password:password}).then(function (results) {
			    return results.data;
            });
        };
        
        /*  categories  */
        
        factory.getCategories = function () {
            return $http.get(baseUrl+categoriesUrl).then(function (results) {
                return results.data;
            });
        };
        
        factory.getCategory = function (id) {
            return $http.get(baseUrl+categoriesUrl+":"+id).then(function (results) {
                return results.data;
            });
        };
        
        factory.createCategory = function (category, description) {
            return $http.post(baseUrl+categoriesUrl,{category:category, description:description}).then(function (results) {
                return results.data;
            });
        };
        
        factory.updateCategory = function (id, category, description) {
            return $http.put(baseUrl+categoriesUrl+":"+id,{category:category, description:description}).then(function (results) {
                return results.data;
            });
        };
        
        factory.deleteCategory = function (id) {
            return $http.delete(baseUrl+categoriesUrl+":"+id).then(function (results) {
                return results.data;
            });
        };
        
        /*  mapLocations  */
        
        factory.getMapLocations = function () {
            return $http.get(baseUrl+mapLocationsUrl).then(function (results) {
                return results.data;
            });
        };
        
        factory.getMapLocation = function (id) {
            return $http.get(baseUrl+mapLocationsUrl+":"+id).then(function (results) {
                return results.data;
            });
        };
        
        factory.createMapLocation = function (category, description) {
            return $http.post(baseUrl+mapLocationsUrl,{category:category, description:description}).then(function (results) {
                return results.data;
            });
        };
        
        factory.updateMapLocation = function (id, category, description) {
            return $http.put(baseUrl+mapLocationsUrl+":"+id,{category:category, description:description}).then(function (results) {
                return results.data;
            });
        };
        
        factory.deleteMapLocation = function (id) {
            return $http.delete(baseUrl+mapLocationsUrl+":"+id).then(function (results) {
                return results.data;
            });
        };
        
        factory.initialize = function(){
            
        }
		factory.login("mika@mika.com", "123456");
        return factory;
    };

    dataService.$inject = ["$http"];

    angular.module('mapApp').factory('dataService', dataService);

}());

