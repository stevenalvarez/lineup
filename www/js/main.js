
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

//CIUDADES
$(document).on("pagebeforeshow","#ciudades",function(event){
    var page_id = $(this).attr("id");
    IDIOMA = getUrlVars()["idioma"];
    getCiudades(page_id);
});

//MENU
$(document).on("pagebeforeshow","#menu",function(event){
    var pa_ge_id = $(this).attr("id");
    CIUDAD_ID = getUrlVars()["ciudad_id"];
});

//CLUBS
$(document).on("pagebeforeshow","#clubs",function(event){
    var page_id = $(this).attr("id");
    getClubs(page_id);
});

//CLUB DESCRIPCION
$(document).on("pagebeforeshow","#club_descripcion",function(event){
    var page_id = $(this).attr("id");
    var id = getUrlVars()["id"];
    getClubBy(page_id, id);
});

//GOOGLE MAP
$('#google_map').on('pagebeforeshow', function(event, ui) {
    var page_id = $(this).attr("id");
    showGoogleMap(getUrlVars()["latitud"],getUrlVars()["longitud"]);
});

/************************************ FUNCTIONS *******************************************************/
