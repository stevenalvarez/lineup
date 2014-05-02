
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

//SESIONES
$(document).on("pagebeforeshow","#sesiones",function(event){
    var page_id = $(this).attr("id");
    getSesiones(page_id);
});

//SESIONES DESCRIPCION
$(document).on("pagebeforeshow","#sesion_descripcion",function(event){
    var page_id = $(this).attr("id");
    var id = getUrlVars()["id"];
    getSesionBy(page_id, id);
});

//PUBS
$(document).on("pagebeforeshow","#pubs",function(event){
    var page_id = $(this).attr("id");
    getPubs(page_id);
});

//CALENDARIO
$(document).on("pagebeforeshow","#calendario",function(event){
    var page_id = $(this).attr("id");
    getCalendario(page_id);
});

//GOOGLE MAP
$(document).on('pagebeforeshow',"#google_map", function(event, ui) {
    var page_id = $(this).attr("id");
    showGoogleMap(getUrlVars()["latitud"],getUrlVars()["longitud"]);
});

/************************************ FUNCTIONS *******************************************************/
