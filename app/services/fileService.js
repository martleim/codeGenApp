(function () {
    

    var fileService = function () {
        
        var factory = {};
		
		factory.saveGenerated = function(model,generated){
			var zip = new JSZip();
			zip.file("model.json", model);
			for(var i in generated){
				var name=i;
				var data=generated[i];
				if(data instanceof Object){
					data=JSON.stringify(data);
				}
				zip.file("generated"+name+"", data);
				
			}
			
			window.location = "data:application/zip;base64," + zip.generate({type:"base64"});
		}

        return factory;
    };
    
    //fileService.$inject = ["$http","$q"];

    angular.module("codeGenApp").factory("fileService", fileService);

}());