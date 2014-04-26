
/************************************ BIND EVENT *******************************************************/

$(document).bind('pagebeforecreate', function(event){
    var page_id = event.target.id;
});

$(document).bind('pagecreate', function(event){
    var page_id = event.target.id;
});

$(document).bind('pageinit', function(event){
    var page_id = event.target.id;
});

$(document).bind('pageshow', function(event, ui) {
    var page_id = event.target.id;
    
    //inicializamos la ubicacion 
    getLocationGPS();
});

/************************************ EVENTOS *******************************************************/
$(document).on("pagebeforeshow","#ciudades",function(event){
    var page_id = $(this).attr("id");
    getCiudades(page_id);
});

//GOOGLE MAP
$('#google_map').on('pagebeforeshow', function(event, ui) {
    var page_id = $(this).attr("id");
    showGoogleMap(getUrlVars()["latitud"],getUrlVars()["longitud"]);
});

/************************************ FUNCTIONS *******************************************************/
