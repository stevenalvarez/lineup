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
}