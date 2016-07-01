// Elementlist data array for filling in info box
var elementListData = [];
var elementAtts=[];
var baseURL="";
// DOM Ready =============================================================
$(document).ready(function() {

    baseURL=$("h1").text().toLowerCase();
    
    elementAtts=[];
    elementAtts.push("_id");
    // For each item in our JSON, add a table row and cells to the content string
    $('#elementList th').each(function( index ) {
        if($( this ).text()!="")
            elementAtts.push($( this ).text());
    });
    
    // Populate the element table on initial page load
    populateTable();
    // Elementname link click
    //$('#elementList table tbody').on('click', 'td a.linkshowelement', showElementInfo);
    
    // Add Element button click
    $('#btnAddElement').on('click', addElement);
    $('#btnEditElement').on('click', confirmEditElement);
    // Delete Element link click
    //$('#elementList table tbody').on('click', 'td a.linkdeleteelement', deleteElement);
    
    $( "input[ref]" ).on('click', function(e){openPicker(e.target);});
    $( "input[ref]" ).attr('readonly', true);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON( "/"+baseURL, function( data ) {
        elementListData = data;
        
        $.each(data, function(index){
            tableContent += '<tr rel="' + this._id + '">';
            for(var i=1;i<elementAtts.length;i++){
                var value=this[elementAtts[i]];
                if(!isNaN(Date.parse(value))){
                    value=tryGetDate(value);
                    this[elementAtts[i]]=value;
                    value=(new Intl.DateTimeFormat()).format(value);
                }
                tableContent+="<td>"+value+"</td>";
            }
            
            tableContent+="<td><button type='button' onclick='editElement("+index+")'>edit</button><button type='button' onclick='deleteElement("+index+")'>delete</button></td>";
            tableContent+="</tr>";
                
        });

        // Inject the whole content string into our existing HTML table
        $('#elementList table tbody').html(tableContent);
    });
};

function tryGetDate(value){
    if(!isNaN(Date.parse(value))){
        var time=Date.parse(value);
        value=new Date();
        value.setTime(time);
        
    }
    return value;
}


// Show Element Info
function showElementInfo(index) {

    // Retrieve elementname from link rel attribute
    //var thisElementName = $(this).attr('rel');

    // Get Index of object based on id value
    //var arrayPosition = elementListData.map(function(arrayItem) { return arrayItem.elementname; }).indexOf(thisElementName);
    var arrayPosition = index;

    // Get our Element Object
    var thisElementObject = elementListData[arrayPosition];

    for(var i=0;i<elementAtts.length;i++){
        var value=thisElementObject[elementAtts[i]];
        $('#span_'+elementAtts[i]).text(value);
        var input=$('#input_'+elementAtts[i]);
        
        if(input.attr("type").toLowerCase()=="date"){
            input[0].valueAsDate=tryGetDate(value);
        }else{
            input.val(value);
        }
    }

};

// Add Element
function addElement(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addElement input').each(function(index, val) {
        if($(this).val() === '' && $(this).attr("required")=="true" && $(this).attr("type")!="hidden") { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all element info into one object
        
        
        
        newElement=getFormElement();
        /*for(var i=0;i<elementAtts.length;i++)
            newElement[elementAtts[i]]=$('#input_'+elementAtts[i]).val();*/

        // Use AJAX to post the object to our addelement service
        $.ajax({
            type: 'POST',
			contentType: "application/json; charset=utf-8",
            data: JSON.stringify(newElement),
            url: "/"+baseURL,
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.message && response.message!="OK" && response.message!="") {
                alert('Error: ' + response.message);

            }
            else {
                $('#formFields input').val('');
                populateTable();
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};



// Delete Element
function deleteElement(index) {
    var id=elementListData[index]._id;
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this element?');

    // Check and make sure the element confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
			contentType: "application/json; charset=utf-8",
            url: '/'+baseURL+'/' + id
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.message && response.message != '') {
                alert('Error: ' + response.message);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};


function getFormElement(){
    var newElement = $("#formFields").serializeArray();
    var parsedNewElement={};
	
	function isArray(name){
		var field=$("#formFields").find("[name*='"+name+"']");
		return (field.attr("ref") && field.attr("ref").indexOf("[")>=0);
	}
	
    for(var i=0;i<newElement.length;i++){
        if(newElement[i].name!="_id" || (newElement[i].name=="_id" && newElement[i].value!="")){
			var value=newElement[i].value;
			if(value!="" && isArray(newElement[i].name) ){
				if(value.indexOf("]")<0){
					value="[\""+value.split(",").join("\",\"")+"\"]";
				}
				value=JSON.parse(value);
			}else if(value=="" && isArray(newElement[i].name) ){
				value=[];
			}
			if(newElement[i].name.indexOf(".")<0){
				parsedNewElement[newElement[i].name]=value;
			}else{
				var atts=newElement[i].name.split(".");
				var el=null;
				while(atts.length>0){
					var att=atts.shift();
					if(!parsedNewElement[att]){
						var where=(el||parsedNewElement);
						el={};
						where[att]=el;
					}
					if(atts.length==0){
						where[att]=value;
					}
				}
			}
        }
    }
    return parsedNewElement;
}


// Edit Element
function editElement(index) {
    showElementInfo(index);
    $('#btnAddElement').hide();
    $('#btnEditElement').show();
}

// Edit Element
function confirmEditElement() {
    $('#btnAddElement').show();
    $('#btnEditElement').hide();
    
    var confirmation = confirm('Are you sure you want to edit this element?');

    var newElement=getFormElement();
    var id=newElement._id;
    delete newElement._id;
    // Check and make sure the element confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'PUT',
            url: '/'+baseURL+'/' + id,
			contentType: "application/json; charset=utf-8",
            data:JSON.stringify(newElement),
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.message && response.message != '') {
                alert('Error: ' + response.message);
            }

            // Update the table
            populateTable();

        });

    }
    
    for(var i=0;i<elementAtts.length;i++){
        $('#span_'+elementAtts[i]).text("");
        $('#input_'+elementAtts[i]).val("");
    }
}

function openPicker(el){
    
    var type=$(el).attr("ref");
    var value=$(el).val();
    
    type=(type.indexOf("[")<0)?type:type.substring(1,type.length-1);
    
    var modal=WindowManager.getInstance().openModal( { closeButton:true, width:1200, 
                                                      contentUrl:"picker/"+type
                                            //contentHTML:'<div id="crudPicker"><div id="elementList"><table><thead><th>email</th><th>userName</th><th>password</th><th>name</th><th>surName</th><th>birthday</th><th>telephone</th><th>address</th><th>modified</th><th></th></thead><tbody></tbody></table></div><br/><button id="btnOk">Ok</button><button id="btnCancel">Cancel</button></div>'
                                            , title:"Picker"
                                            , footer:'<button type="button" class="btn btn-danger" onclick="acceptPickerModal()">Ok</button>', onLoad:function(modal){iniPicker(modal,value);} } );
    
    modal[0].input=el;
    //iniPicker(modal);
    
}


/*crud picker*/

// Elementlist data array for filling in info box
var pickerModals=[];
// DOM Ready =============================================================
function iniPicker(modal,data){

	var selectedData={};
	
	if(data!="" && data.indexOf(",")){
		data=data.split("[").join("").split("]").join("");
		data=data.split(",");
		
		for(var i=0;i<data.length;i++){
			selectedData[data[i]]=true;
		}
		
	}else if(data!=""){
		selectedData[data]=true;
	}

    pickerModals.push(modal);

    modal[0].baseURL=modal[0].input.getAttribute("ref");
    modal[0].baseURL=(modal[0].baseURL.indexOf("[")<0)?modal[0].baseURL:modal[0].baseURL.substring(1,modal[0].baseURL.length-1);
    
    modal[0].elementAtts=[];
    modal[0].elementAtts.push("_id");
    // For each item in our JSON, add a table row and cells to the content string
    modal.find('#elementList th').each(function( index ) {
        if($( this ).text()!="")
            modal[0].elementAtts.push($( this ).text());
    });
    
    // Populate the element table on initial page load
    populatePickerTable(modal,selectedData);
    // Elementname link click
    //$('#elementList table tbody').on('click', 'td a.linkshowelement', showElementInfo);
    
    // Add Element button click
    modal.find('#btnOk').on('click', addElement);
    modal.find('#btnCancel').on('click', confirmEditElement);
    // Delete Element link click
    //$('#elementList table tbody').on('click', 'td a.linkdeleteelement', deleteElement);


}

// Functions =============================================================

// Fill table with data
function populatePickerTable(md,selectedData) {
    selectedData=selectedData||{};
    var modal=md;
	

    // Empty content string
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON( "/"+modal[0].baseURL, function( data ) {
        modal[0].elementListData = data;
        
        $.each(data, function(index){
            tableContent += '<tr rel="' + this._id + '">';
            for(var i=1;i<modal[0].elementAtts.length;i++){
                var value=this[modal[0].elementAtts[i]];
                if(!isNaN(Date.parse(value))){
                    value=tryGetDate(value);
                    this[modal[0].elementAtts[i]]=value;
                    value=(new Intl.DateTimeFormat()).format(value);
                }
                tableContent+="<td>"+value+"</td>";
            }
            
            tableContent+="<td>";//<button type='button' onclick='selectElement("+index+")'>select</button>
            
            if(modal[0].input.getAttribute("ref").indexOf("[")<0){
                tableContent+="<input type='radio' "+(selectedData[this._id]?" checked='true' ":"")+" />";
            }else{
                tableContent+="<input type='checkbox' "+(selectedData[this._id]?" checked='true' ":"")+" />";
            }
            
            tableContent+="</td>";
            tableContent+="</tr>";
                
        });

        // Inject the whole content string into our existing HTML table
        modal.find('#elementList table tbody').html(tableContent);
    });
};

// Select Element
function acceptPickerModal(index) {
    var modal=pickerModals.pop();
    var single=modal.find("input[type=radio]").length>0;
    var inputs=(single)?modal.find("input[type=radio]"):modal.find("input[type=checkbox]");
    var elements=[];
    inputs.each(function( index ) {
        if( $( this )[0].checked ){
            elements.push(modal[0].elementListData[index]._id);
        }
    });
    
    if(single){
        modal[0].input.value=elements[0];
    }else{
        modal[0].input.value=JSON.stringify(elements);//elements.join(",");
    }
    
    WindowManager.getInstance().closeModal(modal[0].id);

};
