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

function animation(container,parent){
    //ocultamos los elementos
    container.find(".content_middle").hide();
    container.find(".content_bottom").hide();
    container.find(".content_top").css("padding-top",(parent.height()-90)+'px').attr("lang",parent.height()-90);
    
    container.find(".toogle").unbind("touchstart").bind("touchstart", function(){
        var element = $(this);
        if(element.hasClass("up")){
            element.parent().parent().animate({"padding-top": "40px",}, 500, "linear", function() {
                element.removeClass("up").addClass("down");
                element.parent().parent().parent().find(".content_middle").fadeIn();
                element.parent().parent().parent().find(".content_bottom").fadeIn();
            });
        }else if(element.hasClass("down")){
            element.parent().parent().animate({"padding-top": element.parent().parent().attr("lang")+"px",}, 500, "linear", function() {
                element.removeClass("down").addClass("up");
                element.parent().parent().parent().find(".content_middle").fadeOut();
                element.parent().parent().parent().find(".content_bottom").fadeOut();
            });
        }
    });    
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
            
            var fondo = data.fondo.Fondo.imagen;
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
            var goto_index = 0;
            
            //mostramos loading
            $.mobile.loading( 'show' );
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
        		    
                    //vemos a que item deber ir
                    if(item.Club.id == club_id){
                        goto_index = index;
                    }
                    
                    var id = item.Club.id;
                    var title = IDIOMA == "castellano" ? item.Club.title_esp : item.Club.title_eng;
                    var sub_title = item.Club.sub_title;
                    var imagen = item.Club.imagen!=""?item.Club.imagen:"default.png";
                    var imagen_redonda = item.Club.imagen_redonda!=""?item.Club.imagen_redonda:"default.png";
                    var imagen_fondo = item.Club.imagen_fondo!=""?item.Club.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Club.descripcion_esp : item.Club.descripcion_eng;
                    var direccion = item.Club.direccion;
                    var telefono = item.Club.telefono;
                    
                    var html='<div class="container" style="background: url('+BASE_URL_APP+'img/clubs/'+imagen_fondo+');background-size: 100% auto;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/clubs/' + imagen_redonda + '" />' +
                            '</div>' +
                            '<div class="title left">'+
                                '<a class="sub toogle up" href="javascript:void(0)">' +
                                    '<h2>'+title+'</h2>' + sub_title +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="content_middle">' +
                            '<p class="descripcion">' + descripcion +'</p>' +
                            '<div class="mas_informacion">' +
                                '<p class="direccion">' +
                                    '<b>direcci&oacute;n:</b>' +
                                    '<span>'+ direccion +'</span>' +
                                '</p>' +
                                '<p class="telefono">' +
                                    '<b>tel&eacute;fono:</b>' +
                                    '<span>'+ telefono +'</span>' +
                                '</p>' + 
                            '</div>' +
                        '</div>' +
                        '<div class="content_bottom">' +
                            '<div data-role="navbar" data-corners="false">'+
                                '<ul class="nav_options">' +
                                    '<li class="mapa"><a class="icon_mapa" href="google_map.html?latitud=40.714594&longitud=-3.989803" data-icon="none" data-iconpos="top">4km</a></li>' +
                                    '<li class="tickets"><a class="icon_tickets" href="#" data-icon="none" data-iconpos="top">Tickets</a></li>' +
                                    '<li class="sesiones"><a class="icon_sesiones" href="#" data-icon="none" data-iconpos="top">Sesiones</a></li>' +
                                    '<li class="alertas"><a class="icon_alertas" href="#" data-icon="none" data-iconpos="top">Alerta</a></li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        		    
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    $('<img>').attr('src',function(){
                        var imgUrl = container.find(".container:first").css('background-image');
                        imgUrl = imgUrl.substring(4, imgUrl.length-1);
                        return imgUrl;
                    }).load(function(){
                                        
                        //refresh
                		$('[data-role="navbar"]').navbar();
                        
                        /* carrousel */
                        container.owlCarousel({
                            pagination : true,
                            items : 1,
                            itemsDesktop : false,
                            itemsDesktopSmall : false,
                            itemsTablet: false,
                            itemsMobile : false,
                            afterInit : function(){
                                setTimeout(function(){
                                    container.trigger('owl.goTo', goto_index);
                                },1000);
                            }
                        });
                        
                        animation(container,parent);
                        
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

function getSesiones(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".ui-listview");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'sesions/mobileGetSesions/'+CIUDAD_ID, function(data) {
        
        if(data.items){
            //mostramos loading
            $.mobile.loading( 'show' );
            
            var fondo = data.fondo.Fondo.imagen;
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Sesion.id;
                    var title = IDIOMA == "castellano" ? item.Sesion.title_esp : item.Sesion.title_eng;
                    var imagen = item.Sesion.imagen!=""?item.Sesion.imagen:"default.png";
                    var imagen_fondo = item.Sesion.imagen_fondo!=""?item.Sesion.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Sesion.descripcion_esp : item.Sesion.descripcion_eng;
                    
                    var html='<li>' +
                        '<h2>lunes '+title+'</h2>' +
                        '<a href="sesion_descripcion.html?id='+id+'"><img src="'+BASE_URL_APP+'img/sesions/' + imagen + '"/></a>' +
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

function getSesionBy(parent_id, sesion_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'sesions/mobileGetSesions/'+CIUDAD_ID, function(data) {
        
        if(data.items){
            var goto_index = 0;
            //mostramos loading
            $.mobile.loading( 'show' );
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
        		  
                    //vemos a que item deber ir
                    if(item.Sesion.id == sesion_id){
                        goto_index = index;
                    }
                    
                    var id = item.Sesion.id;
                    var title = IDIOMA == "castellano" ? item.Sesion.title_esp : item.Sesion.title_eng;
                    var sub_title = item.Sesion.sub_title;
                    var imagen = item.Sesion.imagen!=""?item.Sesion.imagen:"default.png";
                    var imagen_redonda = item.Sesion.imagen_redonda!=""?item.Sesion.imagen_redonda:"default.png";
                    var imagen_fondo = item.Sesion.imagen_fondo!=""?item.Sesion.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Sesion.descripcion_esp : item.Sesion.descripcion_eng;
                    var direccion = item.Sesion.direccion;
                    var telefono = item.Sesion.telefono;
                    
                    var html='<div class="container custom" style="background: url('+BASE_URL_APP+'img/sesions/'+imagen_fondo+');background-size: 100% auto;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/sesions/' + imagen_redonda + '" />' +
                            '</div>' +
                            '<div class="title left">'+
                                '<a class="sub toogle up" href="javascript:void(0)">' +
                                    '<h2>'+title+'</h2>' + sub_title +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="content_middle">' +
                            '<p class="descripcion">' + descripcion +'</p>' +
                            '<div class="mas_informacion">' +
                                '<p class="direccion">' +
                                    '<b>direcci&oacute;n:</b>' +
                                    '<span>'+ direccion +'</span>' +
                                '</p>' +
                                '<p class="telefono">' +
                                    '<b>tel&eacute;fono:</b>' +
                                    '<span>'+ telefono +'</span>' +
                                '</p>' + 
                            '</div>' +
                        '</div>' +
                        '<div class="content_bottom">' +
                            '<div data-role="navbar" data-corners="false">'+
                                '<ul class="nav_options">' +
                                    '<li class="mapa"><a class="icon_mapa" href="google_map.html?latitud=40.714594&longitud=-3.989803" data-icon="none" data-iconpos="top">4km</a></li>' +
                                    '<li class="tickets"><a class="icon_tickets" href="#" data-icon="none" data-iconpos="top">Tickets</a></li>' +
                                    '<li class="alertas"><a class="icon_alertas" href="#" data-icon="none" data-iconpos="top">Alerta</a></li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        		    
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    $('<img>').attr('src',function(){
                        var imgUrl = container.find(".container:first").css('background-image');
                        imgUrl = imgUrl.substring(4, imgUrl.length-1);
                        return imgUrl;
                    }).load(function(){
                                        
                        //refresh
                		$('[data-role="navbar"]').navbar();
                        
                        /* carrousel */
                        container.owlCarousel({
                            pagination : true,
                            items : 1,
                            itemsDesktop : false,
                            itemsDesktopSmall : false,
                            itemsTablet: false,
                            itemsMobile : false,
                            afterInit : function(){
                                setTimeout(function(){
                                    container.trigger('owl.goTo', goto_index);
                                },1000);
                            }
                        });
                        
                        animation(container,parent);
                        
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

function getPubs(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".content_options");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'pubs/mobileGetPubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
        
        if(data.items){
            //mostramos loading
            $.mobile.loading( 'show' );
            
            var fondo = data.fondo.Fondo.imagen;
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Pub.id;
                    var title = IDIOMA == "castellano" ? item.Pub.title_esp : item.Pub.title_eng;
                    var sub_title = item.Pub.sub_title;
                    var imagen = item.Pub.imagen!=""?item.Pub.imagen:"default.png";
                    var imagen_fondo = item.Pub.imagen_fondo!=""?item.Pub.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Pub.descripcion_esp : item.Pub.descripcion_eng;
                    
                    var html='<a class="custom pub1" href="pub_descripcion.html?id='+id+'" data-role="button" data-icon="none">' +
                        '<span class="bg">' +
                            '<span class="title">'+title+'</span>' +
                            '<span class="subtitle">'+sub_title+'</span>' +
                            '<span class="km">300m</span>'
                        '</span>' +
                    '</a>';
        		    
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
                    container.find("a").each(function( index ) {
                        //$(this).filter(".pub1:after").css("border","1px solid red");
                        //$(this).find(".ui-icon").css("background","url('"+BASE_URL_APP+"img/comofunciona/rosa/"+$(this).attr("lang")+"')  no-repeat scroll top center transparent");
                        //$(this).find(".ui-icon").css("background-size","28px");
                    });
                        
                    //ocultamos loading
                    $.mobile.loading( 'hide' );
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                    $('<img>').removeAttr("src");
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

function getCalendario(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".contenedor_calendario");
    parent.find(".ui-content").hide();
    container.find(".datepicker").parent().hide();
    parent.find(".ui-content").fadeIn("slow");
}

function ajaxCalendario(value){
    var container = $("#tickets.lista");
    container.html("");
    
	$.getJSON(BASE_URL_APP + 'tickets/mobileGetTicketByDate/'+value, function(data) {
        showLoading();
        
        if(data.items){
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
        		  
                    var id = item.Sesion.id;
                    var title = IDIOMA == "castellano" ? item.Sesion.title_esp : item.Sesion.title_eng;
                    var title_dj = IDIOMA == "castellano" ? item.Dj.title_esp : item.Dj.title_eng;
                    var imagen_redonda = item.Sesion.imagen_redonda!=""?item.Sesion.imagen_redonda:"default.png";
                    var precio = item.Ticket.precio;
                    
                    var href = "javascript:alert('Tickets no disponibles para esta sesi\u00F3n')";
                    if(precio != "") href = "tickets.html?id="+id;
                    
                    var html='<a class="custom pub1" href="'+href+'" data-role="button" data-icon="none">' +
                            '<span class="bg">' +
                                '<span class="title">'+title+'</span>' +
                                '<span class="subtitle">'+title_dj+'</span>' +
                                '<span class="km inline">300m</span>' +
                                '<span class="euro inline">'+precio+'&euro;</span>' +
                            '</span>' +
                        '</a>';
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
                    //ocultamos loading
                    hideLoading();
                });
            }else{
                //ocultamos loading
                hideLoading();
            }
        }
	});
}