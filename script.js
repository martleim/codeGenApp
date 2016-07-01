function init(){
	SI.Files.stylizeAll();
}

function saveModel(json){
	
	removeHashKey(json);

	var blob = new Blob([JSON.stringify(json)], {type: "application/json"});
	//var url  = URL.createObjectURL(blob);
	var url='data:text/csv;charset=UTF-8,' + '\uFEFF' + (JSON.stringify(json));
	
	var aLink = document.createElement('a');
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click");
    aLink.download = "model.json";
    aLink.href = url;
    aLink.dispatchEvent(evt);
	
	/*var html="<form target='iframe' action='"+url+"'></form><iframe name='iframe' style='height:1px;width:1px'></iframe>";
	var div=document.createElement("div");
	div.innerHTML=html;
	document.body.appendChild(div);
	div.firstChild.submit();
	setTimeout(function(){
		document.body.removeChild(div);
	},600);*/
}

function removeHashKey(json){
	for(var i in json){
		if(i=="$$hashKey"){
			delete json["$$hashKey"];
		}else{
			if(typeof json[i] === 'object')
				removeHashKey(json[i]);
		}
	}	
	
}

function loadModel(){

}