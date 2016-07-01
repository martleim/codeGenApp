// Elementlist data array for filling in info box
var pickerElementListData = [];
var pickerElementAtts=[];
var baseURL="";
// DOM Ready =============================================================
function iniPickerGrid(){

    baseURL=$("#crudPicker").find("h1").text().toLowerCase();
    
    pickerElementAtts=[];
    pickerElementAtts.push("_id");
    // For each item in our JSON, add a table row and cells to the content string
    $("#crudPicker").find('#elementList th').each(function( index ) {
        if($( this ).text()!="")
            pickerElementAtts.push($( this ).text());
    });
    
    // Populate the element table on initial page load
    populateTable();
    // Elementname link click
    //$('#elementList table tbody').on('click', 'td a.linkshowelement', showElementInfo);
    
    // Add Element button click
    $("#crudPicker").find('#btnOk').on('click', addElement);
    $("#crudPicker").find('#btnCancel').on('click', confirmEditElement);
    // Delete Element link click
    //$('#elementList table tbody').on('click', 'td a.linkdeleteelement', deleteElement);


}
iniPickerGrid();
// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON( "/"+baseURL, function( data ) {
        pickerElementListData = data;
        
        $.each(data, function(index){
            tableContent += '<tr rel="' + this._id + '">';
            for(var i=1;i<pickerElementAtts.length;i++){
                var value=this[pickerElementAtts[i]];
                if(!isNaN(Date.parse(value))){
                    value=tryGetDate(value);
                    this[pickerElementAtts[i]]=value;
                    value=(new Intl.DateTimeFormat()).format(value);
                }
                tableContent+="<td>"+value+"</td>";
            }
            
            tableContent+="<td><button type='button' onclick='selectElement("+index+")'>select</button></td>";
            tableContent+="</tr>";
                
        });

        // Inject the whole content string into our existing HTML table
        $("#crudPicker").find('#elementList table tbody').html(tableContent);
    });
};

// Select Element
function selectElement(index) {
    var id=pickerElementListData[index]._id;
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this element?');

    // Check and make sure the element confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
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
