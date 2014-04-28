/************************************ FUNCTIONS APP *******************************************************/

/* FUNCTION GENERALES DE LA APP */
//isLogin
function isLogin(){
    var res = false;
    var cookie_user = $.parseJSON(readCookie("user"));
    if(cookie_user !== null){
        res = true;
        COOKIE = cookie_user;
    }
    return res;
}


//Abrimos el enlace en un navegador del sistema (IOS|ANDROID)
//target: the target to load the URL in (String) (Optional, Default: "_self")
//_self - opens in the Cordova WebView if url is in the white-list, else it opens in the InAppBrowser 
//_blank - always open in the InAppBrowser 
//_system - always open in the system web browser/
function openOnWindow(element, target){
	element.find('a').bind("click", function() {
	   window.open($(this).attr('href') , target );
	   return false;
	});
}

/*EVENTOS QUE SE LANZAN AL MOMENTO DE CAMBIAR DE LANSCAPE A PORTRAIT O VICEVERSA*/
/*orientation:puede ser lanscape o portrait*/
/*page_id:el id de la pagina actual en el que se realizo el movimiento*/
function callbackOrientationChange(orientation, page_id){
    
}

//MOSTRAMOS EL GOOGLE MAP DEL LOCAL
function showGoogleMap(latitud, longitud) {
    var map;
    var marcador;
    if(latitud != "" && longitud != ""){
        var latlng = new google.maps.LatLng(latitud, longitud);
        var myOptions = {
          zoom: 16,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControl: true
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
        marcador = new google.maps.Marker({position: latlng, map: map});
    }
}

//showNotification
function showNotification(event, type){
    var message = type == "android" ? event.message : event.alert;
    var seccion = type == "android" ? event.payload.seccion : event.seccion;
    var seccion_id = type == "android" ? event.payload.seccion_id : event.seccion_id;
    
    navigator.notification.alert(
        message,
        function(){
            redirectToPage(seccion, seccion_id);
        },
        "Alert",
        "Aceptar"
    );
}

//redirectToPage
function redirectToPage(seccion, id){
    var page = "";
    if(seccion == "local"){
        page = "#guia"
        if(id != ""){
            page = "local_descripcion.html?id="+id;
        }        
    }else if(seccion == "plan"){
        page = "planes.html";
        if(id != ""){
            page = "plan_descripcion.html?id="+id;
        }
    }else if(seccion == "recompensa"){
        page = "#recompesas";
        if(id != ""){
            page = "recompensa_descripcion.html?id="+id;
        }
    }
    
    if(seccion != ""){
        setTimeout(function(){
            $.mobile.changePage(page);
        },400);
    }else{
        //TODO
    }
}

function getCiudades(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'ciudads/mobileGetCiudades', function(data) {
        
        if(data.items){
            //mostramos loading
            $.mobile.loading( 'show' );
            
    		var items = data.items;
            var idioma = data.idioma;
            idioma = IDIOMA == "castellano" ? idioma.Sistema.title_esp : idioma.Sistema.title_eng;
            
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Ciudad.id;
                    var title = IDIOMA == "castellano" ? item.Ciudad.title_esp : item.Ciudad.title_eng;
                    var imagen_fondo = item.Ciudad.imagen_fondo!=""?item.Ciudad.imagen_fondo:"default.png";
                    
                    var html='<div class="ciudad" style="background: url('+BASE_URL_APP+'img/ciudades/'+imagen_fondo+');background-size: 100%;">' +
                        '<a href="menu.html?ciudad_id='+id+'">'+title+'</a>' +
                        '</div>';
        		    
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    $('<img>').attr('src',function(){
                        var imgUrl = container.find(".ciudad:first").css('background-image');
                        imgUrl = imgUrl.substring(4, imgUrl.length-1);
                        return imgUrl;
                    }).load(function(){
                        
                        /* carrousel */
                        container.owlCarousel({
                            pagination : true,
                            items : 1,
                            itemsDesktop : false,
                            itemsDesktopSmall : false,
                            itemsTablet: false,
                            itemsMobile : false
                        });
                        
                        setTimeout(function(){
                            container.find(".ciudad").css("padding-top",(parent.height()-70)+'px');
                        },100);
                        
                        //colocamos el texto segun el idioma
                        parent.find(".ui-header").find(".text").html(idioma);
                        
                        //ocultamos loading
                        $.mobile.loading( 'hide' );
                        hideLoading();
                        parent.find(".ui-content").fadeIn("slow");
                        $('<img>').removeAttr("src");
                    });
                });
            }else{
                //ocultamos loading
                $.mobile.loading( 'hide' );
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

function getClubs(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".ui-listview");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'clubs/mobileGetClubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
        
        if(data.items){
            //mostramos loading
            $.mobile.loading( 'show' );
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Club.id;
                    var title = IDIOMA == "castellano" ? item.Club.title_esp : item.Club.title_eng;
                    var imagen = item.Club.imagen!=""?item.Club.imagen:"default.png";
                    var imagen_fondo = item.Club.imagen_fondo!=""?item.Club.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Club.descripcion_esp : item.Club.descripcion_eng;
                    
                    var html='<li>' +
                        '<a href="club_descripcion.html?id='+id+'"><img src="'+BASE_URL_APP+'img/clubs/' + imagen + '"/></a>' +
                        '</li>';
        		    
                    container.append(html);
        		});
                
                //refresh
        		//container.listview('refresh');
                
                container.find("li:last img").load(function() {
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                });
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS NING&Uacute;N ITEM.</p>");
                //ocultamos loading
                $.mobile.loading( 'hide' );
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

function getClubBy(parent_id, club_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'clubs/mobileGetClubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
        
        if(data.items){
            //mostramos loading
            $.mobile.loading( 'show' );
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Club.id;
                    var title = IDIOMA == "castellano" ? item.Club.title_esp : item.Club.title_eng;
                    var imagen = item.Club.imagen!=""?item.Club.imagen:"default.png";
                    var imagen_fondo = item.Club.imagen_fondo!=""?item.Club.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Club.descripcion_esp : item.Club.descripcion_eng;
                    
                    
        		});
                
                container.promise().done(function() {
                    $('<img>').attr('src',function(){
                        var imgUrl = container.find(".container:first").css('background-image');
                        imgUrl = imgUrl.substring(4, imgUrl.length-1);
                        return imgUrl;
                    }).load(function(){
                        
                        /* carrousel */
                        container.owlCarousel({
                            pagination : true,
                            items : 1,
                            itemsDesktop : false,
                            itemsDesktopSmall : false,
                            itemsTablet: false,
                            itemsMobile : false
                        });
                        
                        //ocultamos loading
                        $.mobile.loading( 'hide' );
                        hideLoading();
                        parent.find(".ui-content").fadeIn("slow");
                        $('<img>').removeAttr("src");
                    });
                });
            }else{
                //ocultamos loading
                $.mobile.loading( 'hide' );
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}