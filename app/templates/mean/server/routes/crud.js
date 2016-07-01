var express = require("express");
var router = express.Router();

router.get("/:eltype",function(req, res) {
    var mongoose     = require('mongoose');
    var included=null;
    var elType=req.params.eltype;
    console.log("foud: CHEGOUR "+elType);
    try{
        included = mongoose.model(elType).schema;
        console.log("included.schema "+(included.schema));
    }catch(e){
        console.log("type not foud : "+elType+" "+e.message);
    }
    
    res.render('crud', { title:elType , model:included});
});

router.get("/picker/:eltype",function(req, res) {
    var mongoose     = require('mongoose');
    var included=null;
    var elType=req.params.eltype;
    try{
        included = mongoose.model(elType).schema;
        console.log("included.schema "+(included.schema));
    }catch(e){
        console.log("type not foud : "+elType+" "+e.message);
    }
    
    res.render('crudPicker', { title:elType , model:included});
});

router.get("/models/:filter",function(req, res) {
    var mongoose     = require('mongoose');
	var filter=req.params.filter;
	var models={};
	
	var modelNames = Object.keys(mongoose.models);
	
	for(var i=0;i<modelNames.length;i++){
		var schema = mongoose.model(modelNames[i]).schema;
		if(!schema || !schema.paths)
			continue;
			
		var paths=schema.paths;
		var model=[]
		for(var attributeName in paths){
			var attribute=paths[attributeName];
			var type=attribute.instance;
			var ref='';
			if(attribute.constructor.toString().indexOf("Date")>0){
				type="Date";
			}else if(attribute.options && attribute.options.ref){
				ref=" ref='"+attribute.options.ref+"'"; }
			else if(attribute.options && attribute.options.type instanceof Array && attribute.options.type[0] && attribute.options.type[0].ref){
				ref=" ref='["+attribute.options.type[0].ref+"]'"; 
			}
			var req=false;
			for(var val in paths){
				if(paths[val].validators && paths[val].validators){ 
					for(var v=0;v<paths[val].validators.length;v++){
						if(paths[val].validators[v].type=="required"){
							req=true; 
							break;
						}
					} 
				}
			}
			//var input="input name='"+attributeName+"' id='input_"+attributeName+"' type='"+type+"' placeholder='"+attributeName+"'"+ref;
			model.push({
				name:attributeName,
				type:type,
				ref:ref,
				required:req
			});
		}
		models[modelNames[i]]=model;
	}
	res.json(models);
});


module.exports = router;