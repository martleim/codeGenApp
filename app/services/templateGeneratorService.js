(function () {
    

    var templateGeneratorService = function ($http,$q) {
        
        var factory = {};
		
        factory.templateConfigName="template.config";
        factory.templateBaseUrl="app/templates/";
                
        var TemplateSet = {
            
            locals:[],
            scope:null,
            entities:null,
            generated:[],

            loadTemplates:function(){
                var defer = $q.defer();
                var scope=this;
                scope.templatesLoaded=[];
                angular.forEach(this.files,function(file,index){
                    var fileUrl=factory.templateBaseUrl+scope.name+"/"+(file.template||file.file);
                    var promise=$http.get(fileUrl).then(function (results) {
                        file.data=results.data;
                        scope.loaded=true;
                         if(index==scope.files.length-1){
                            defer.resolve();
                        }
                    });
                   

                },this);
                return defer.promise;
            },
            
            generate:function(model){
                var defer = $q.defer();
                this.appModel=model;
				this.appName=model.appName;
				this.appTitle=model.appTitle;
				this.entities=model.entities;
                this.scope=this;
                var scope=this;
                this.loadTemplates().then(function(){
                    var generated=scope.beginGeneration();
                    defer.resolve();
                });
                return defer.promise;
            },
            
            beginGeneration:function(){
                this.initLocals();
                var _this=this;
                this.scope=this;
                this.generated={};
                angular.forEach(this.files,function(file,index){
                    if(file.template && (!file.parse || file.parse && file.parse=="true")){
                        console.log("parsing template:"+file.template)
                        var parsed=this.parseTemplate(file.data);
						if(!file.save || file.save!="false"){
							var fileName=file.template;
							fileName=fileName.split("_").join(".");
							_this.generated[fileName]=parsed;
						}
                         /*if(index==_this.files.length-1){
                            defer.resolve();
                        }*/
                    }else if(file.file){
						_this.generated[file.file]=file.data;
					}
                },this);
                return _this.generated;
                //return defer.promise;
            },
            
            parseTemplate:function(template){
                template=this.parseTemplateLocals(template);

                var exp =/\<\{([\s\S]*?)\}\>/g,
                matches,
                funcs = [],
                separators = [],
                scope=this;

                while (matches = exp.exec(template)) {
                    separators.push(matches[0]);
                    funcs.push(matches[1]);
                }

                for(var key=0;key<funcs.length;key++){
                    var func=funcs[key];
                    func = func.replace(/\s+/g," ");
                    //func= "try{ return "+func+"}catch(e){console.log(e.stack);}";
                    func= "return "+func;
					var ret;
                    try{
                        var strCode=scope.getLocals()+func;
                        scope.auxFunc=Function(strCode);
                    }catch(e){
                        console.log("COMPILATION ERROR "+e.message+" \n"+scope.getLocals()+func);
                        throw Error("COMPILATION ERROR "+e.message+" \n"+scope.getLocals()+func);
                    }
					try{
						ret=scope.auxFunc.apply(scope);
					}catch(e){
                        console.log("EXECUTION ERROR "+e.message+" \n"+scope.getLocals()+func);
                        throw Error("EXECUTION ERROR "+e.message+" \n"+scope.getLocals()+func);
                    }
                    template=template.split(separators[key]).join(ret);
                }
                this.locals.pop();
        
                return template;
            },
                                          
            initLocals:function(){
                var local="var scope=this;";
                for(var l in this){
                    if(l && l!="" && l!="this"){
                        if (typeof(this[l]) == "function") {

                        }else{
                            local+="var "+l+"=this."+l+";";
                        }
                    }
                };
                this.locals=[local];
            },

            parseTemplateLocals:function(template){
                var exp =/\<\{\!([\s\S]*?)\}\>/g,
                    matches,
                    locals="";

                while (matches = exp.exec(template)) {
                    var func=matches[1];
                    locals+=func.replace(/\s+/g," ");
                    template=template.replace(matches[0],"");
                }
                this.locals.push(locals);
                return template;
            },
            
            getLocals:function(){
                return this.locals.join("");
            },
            
            getSubTemplateByName:function(template){
                var ret={};
                angular.forEach(this.files,function(temp){
                    if(temp.template==template)
                        angular.copy(temp,ret);
                },this);
                return ret;
            },
            
            parseSubTemplate:function(name){
                var template= this.getSubTemplateByName(name);
                return this.parseTemplate(template.data);
            },
			
			parseAndGenerateSubTemplate:function(name,fileName){
                var template= this.getSubTemplateByName(name);
                var parsed = this.parseTemplate(template.data);
				this.generated[fileName]=parsed;
            },
            
            plural:function(str){
                if(str.charAt(str.length-1)=="y"){
                    str=str.substring(0,(str.length-1))+"ies";
                }else{
                    str+="s";
                }
                return str;
            },

            capital:function(str){
                return str.charAt(0).toUpperCase() + str.slice(1);
            },

            pluralCapital:function(str){
                if(str.charAt(str.length-1)=="y"){
                    str=str.substring(0,(str.length-1))+"ies";
                }else{
                    str+="s";
                }
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            
        }
        
        factory.templates=null;
        
        factory.template=null;
        
        factory.entities=null;
        
        factory.loadTemplatesLoaders=function(){
            var defer = $q.defer();
            factory.templates=[];
            $http.get(factory.templateBaseUrl).then(function(results){
                var templatesToLoad=results.data;
                angular.forEach(templatesToLoad,function(templateToLoad,index){
                    var templateToLoadUrl=factory.templateBaseUrl+templateToLoad+"/"+factory.templateConfigName;

                    $http.get(templateToLoadUrl).then(function (results) {
                        var template= results.data;
                        template.loaded=false;
                        template=angular.extend(template,TemplateSet);
                        factory.templates.push(template);
                        if(index==templatesToLoad.length-1)
                            defer.resolve() 
                        
                    });
                    
                },this);
                
                
            });
            return defer.promise;
        };
        
        factory.getTemplateByName=function(name){
            var ret;
            angular.forEach(factory.templates,function(temp){
                if(temp.name==name)
                    ret=temp;
            },this);
            return ret;
        }
        
        factory.generate=function(templateName,entities){
            this.template=factory.getTemplateByName(templateName);
            factory.entities=entities;
            factory.entity=entities[0];
            
            this.template.generate(entities);
            

        };

        return factory;
    };
    
    templateGeneratorService.$inject = ["$http","$q"];

    angular.module("codeGenApp").factory("templateGeneratorService", templateGeneratorService);

}());