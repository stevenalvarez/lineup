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
    //PUSH_NOTIFICATION_TOKEN = "9999";
    //verificamos si esta logeado sino lo esta logeamos automaticamente al usuario
    if(!isLogin() && PUSH_NOTIFICATION_TOKEN == "9999"){
        registerNewDevice();
    }
        
    var page_id = event.target.id;
    //inicializamos la ubicacion 
    getLocationGPS();
});

/************************************ EVENTOS *******************************************************/

//CIUDADES
$(document).on("pagebeforeshow","#ciudades",function(event){
    var page_id = $(this).attr("id");
    var idioma = getUrlVars()["idioma"];
    if(idioma == undefined) idioma = IDIOMA;
    IDIOMA = idioma;
    getCiudades(page_id);
});

//MENU
$(document).on("pagebeforeshow","#menu",function(event){
    var page_id = $(this).attr("id");
    var ciudad_id = getUrlVars()["ciudad_id"];
    if(ciudad_id == undefined) ciudad_id = CIUDAD_ID;
    CIUDAD_ID = ciudad_id;
    getMenu(page_id, CIUDAD_ID);
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
    var club_id = getUrlVars()["id"];
    if(club_id == undefined) club_id = 0;    
    getClubsAll(page_id,club_id);
    getSesiones(page_id,club_id);
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

//PUBS DESCRIPCION
$(document).on("pagebeforeshow","#pub_descripcion",function(event){
    var page_id = $(this).attr("id");
    var id = getUrlVars()["id"];
    getPubBy(page_id, id);
});

//BEACHCLUBS
$(document).on("pagebeforeshow","#beachclubs",function(event){
    var page_id = $(this).attr("id");
    getBeachclubs(page_id);
});

//BEACHCLUBS DESCRIPCION
$(document).on("pagebeforeshow","#beachclubs_descripcion",function(event){
    var page_id = $(this).attr("id");
    var id = getUrlVars()["id"];
    getBeachclubBy(page_id, id);
});

//FESTIVALES
$(document).on("pagebeforeshow","#festivales",function(event){
    var page_id = $(this).attr("id");
    getFestivales(page_id);
});

//FESTIVALES DESCRIPCION
$(document).on("pagebeforeshow","#festivales_descripcion",function(event){
    var page_id = $(this).attr("id");
    var id = getUrlVars()["id"];
    getFestivalBy(page_id, id);
});

//DJS
$(document).on("pagebeforeshow","#djs",function(event){
    var page_id = $(this).attr("id");
    getDjs(page_id);
});

//DJ DESCRIPCION
$(document).on("pagebeforeshow","#dj_descripcion",function(event){
    var page_id = $(this).attr("id");
    var id = getUrlVars()["id"];
    getDjBy(page_id, id);
});

//PROMOCIONES
$(document).on("pagebeforeshow","#promociones",function(event){
    var page_id = $(this).attr("id");
    getPromociones(page_id);
});

//PROMOCION DESCRIPCION
$(document).on("pagebeforeshow","#promocion_descripcion",function(event){
    var page_id = $(this).attr("id");
    var id = getUrlVars()["id"];
    getPromocionBy(page_id, id);
});

//CALENDARIO
$(document).on("pagebeforeshow","#calendario",function(event){
    var page_id = $(this).attr("id");
    var sesion_id = getUrlVars()["sesion_id"];
    if(sesion_id == undefined) sesion_id = 0;
    var club_id = getUrlVars()["club_id"];
    if(club_id == undefined) club_id = 0;
    var parent = $("#"+page_id);
    parent.find(".hasDatepicker").prev().hide();
    var value = parent.find(".hasDatepicker").prev().find("input").val();
    ajaxCalendario(value,club_id,sesion_id);
    
    $( ".hasDatepicker" ).datepicker( "option", "monthNames", $.datepicker.regional[ IDIOMA ].monthNames );
    $( ".hasDatepicker" ).datepicker( "option", "dayNamesMin", $.datepicker.regional[ IDIOMA ].dayNamesMin );
    $( ".hasDatepicker" ).datepicker( "option", "onSelect", function(value, date){
        ajaxCalendario(value,0,0);
    });
    
    //scroll
    scrollToList(parent,parent);
});

//TICKET DESCRIPCION
$(document).on("pagebeforeshow","#ticket_descripcion",function(event){
    var page_id = $(this).attr("id");
    var ticket_id = getUrlVars()["ticket_id"];
    getTicketSesionBy(page_id, ticket_id);
});

//ALERTAS
$(document).on("pagebeforeshow","#alertas",function(event){
    var page_id = $(this).attr("id");
    var slug = getUrlVars()["slug"];
    if(slug == undefined) slug = "clubs";
    getMenuFooter(page_id,slug);
    getAlertas(page_id,slug);
});

//GOOGLE MAP
$(document).on('pagebeforeshow',"#google_map", function(event, ui) {
    var page_id = $(this).attr("id");
    showGoogleMap(page_id, getUrlVars()["latitud"],getUrlVars()["longitud"]);
});

//VENTA TICKET
$(document).on('pagebeforeshow',"#venta_ticket", function(event, ui) {
    var page_id = $(this).attr("id");
    loadIframe(page_id, getUrlVars()["url"], ui.prevPage.attr('id'));
});

//GUEST LIST
$(document).on("pagebeforeshow","#guest_list",function(event){
    var page_id = $(this).attr("id");
    var club_id = getUrlVars()["id"];
    if(club_id == undefined) club_id = 0;
    getClubsAll(page_id,club_id);
    getGuesList(page_id,club_id);
});

/************************************ FUNCTIONS *******************************************************/

//CIUDADES
function getCiudades(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'ciudads/mobileGetCiudades', function(data) {
        
        if(data.items){
            
    		var items = data.items;
            var idioma = data.idioma;
            idioma = IDIOMA == "castellano" ? idioma.Sistema.title_esp : idioma.Sistema.title_eng;
            
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Ciudad.id;
                    var title = IDIOMA == "castellano" ? item.Ciudad.title_esp : item.Ciudad.title_eng;
                    var imagen_fondo = item.Ciudad.imagen_fondo!=""?item.Ciudad.imagen_fondo:"default.png";
                    
                    var html='<a href="menu.html?ciudad_id='+id+'"><div class="ciudad" style="background: url('+BASE_URL_APP+'img/ciudades/'+imagen_fondo+');background-size: 100% 100%;">' +
                        '<span>'+title+'</span>' +
                        '</div></a>';
        		    
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
                            container.find(".ciudad").css("padding-top",(parent.height()-65)+'px');
                        },100);
                        
                        //colocamos el texto segun el idioma
                        parent.find(".ui-header").find(".text").html(idioma);
                        
                        hideLoading();
                        parent.find(".ui-content").fadeIn("slow");
                        $('<img>').removeAttr("src");
                    });
                });
            }else{
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//MENU
function getMenu(parent_id, ciudad_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".ui-content");
    container.hide();
    
    showLoading();
    
    var usuario_id = "";
    if(isLogin()) usuario_id = COOKIE.id;
    
	$.getJSON(BASE_URL_APP + 'sistemas/mobileGetMenu/'+usuario_id+"/"+IDIOMA+"/"+CIUDAD_ID, function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
    		
            var info = data.info;
            var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    var id = item.Sistema.id;
                    var title = IDIOMA == "castellano" ? item.Sistema.title_esp : item.Sistema.title_eng;
                    container.find(".icon"+id).text(title);
                    
                    //Para madrid (id=3)no se muestra beach
                    if(ciudad_id == 3 && id == 8) container.find(".icon"+id).hide();
        		});
                                
                container.promise().done(function() {
                    parent.find(".container_popup .castellano").html(info.Sistema.text_esp)
                    parent.find(".container_popup .english").html(info.Sistema.text_eng)
                    
                    //mostramos la info segun al idioma
                    parent.find(".container_popup ."+IDIOMA).show();
                    
                    hideLoading();
                    container.fadeIn("slow");
                    
                    //mandamos a ver si tiene alguna notificacion pendiente
                    verifyNotification();
                });
            }else{
                hideLoading();
                container.fadeIn("slow");
            }
        }
	});    
    
}

//CLUBS
function getClubs(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".ui-listview");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'clubs/mobileGetClubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
    		
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
                                
                container.find("li:first img").load(function() {
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                });
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS NING&Uacute;N ITEM</p>");
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//CLUB DESCRIPCION
function getClubBy(parent_id, club_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'clubs/mobileGetClubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE+"/"+club_id, function(data) {
        
        if(data.items){
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
        		  
                    var id = item.Club.id;
                    var url = item.Club.url_venta_ticket != undefined ? item.Club.url_venta_ticket : "";
                    var title = IDIOMA == "castellano" ? item.Club.title_esp : item.Club.title_eng;
                    var sub_title = item.Club.sub_title;
                    var imagen = item.Club.imagen!=""?item.Club.imagen:"default.png";
                    var imagen_redonda = item.Club.imagen_redonda!=""?item.Club.imagen_redonda:"default.png";
                    var imagen_fondo = item.Club.imagen_fondo!=""?item.Club.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Club.descripcion_esp : item.Club.descripcion_eng;
                    var direccion = item.Club.direccion;
                    var telefono = item.Club.telefono;
                    var kilomentros = item.Club.kilomentros;
                    var metros = item.Club.metros;
                    var latitud = item.Club.latitud;
                    var longitud = item.Club.longitud;
                    
                    var html='';
                    if(index == 0){
                        html+='<div class="container" style="background: url('+BASE_URL_APP+'img/clubs/'+imagen_fondo+');background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                            '<div class="content_top">' + 
                                '<div class="imagen left">' +
                                    '<img src="'+BASE_URL_APP+'img/clubs/' + imagen_redonda + '" />' +
                                '</div>' +
                                '<div class="title left">'+
                                    '<a class="sub toogle up" href="javascript:void(0)">' +
                                        '<h2>'+title+'</h2>' + sub_title +
                                    '</a>' +
                                '</div>' +
                            '</div>';                        
                    }else{
                        html+='<div class="container" data-src="'+BASE_URL_APP+'img/clubs/'+imagen_fondo+'" style="background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                            '<div class="content_top">' + 
                                '<div class="imagen left">' +
                                    '<img data-src="'+ BASE_URL_APP+'img/clubs/' + imagen_redonda + '" src="" />' +
                                '</div>' +
                                '<div class="title left">'+
                                    '<a class="sub toogle up" href="javascript:void(0)">' +
                                        '<h2>'+title+'</h2>' + sub_title +
                                    '</a>' +
                                '</div>' +
                            '</div>';                        
                    }
                        html+='<div class="content_middle">' +
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
                                    '<li class="mapa"><a class="icon_mapa" href="google_map.html?latitud='+latitud+'&longitud='+longitud+'" data-icon="none" data-iconpos="top">';
                                    //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                                    if(parseInt(kilomentros) < 1){
                                        html+=parseFloat(metros).toFixed(2)+'M';
                                    }else{
                                        html+=parseFloat(kilomentros).toFixed(0)+'KM';
                                    }
                                    html+='</a>' +
                                    '</li>' +
                                    '<li class="tickets"><a class="open icon_tickets" lang="'+encodeURIComponent(url)+'" href="javascript:void(0)" data-icon="none" data-iconpos="top">Tickets</a></li>' +
                                    '<li class="sesiones"><a class="icon_sesiones" href="sesiones.html?id='+id+'" data-icon="none" data-iconpos="top">Sesiones</a></li>' +
                                    '<li class="alertas"><a class="icon_alertas" href="alertas.html?slug=clubs" data-icon="none" data-iconpos="top">Alerta</a></li>' +
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
                            afterMove : function(){
                                var item = this.owl.currentItem;
                                if(item > 0){
                                    setTimeout(function(){
                                        item = parseInt(item) + 1;
                                        var element = container.find(".owl-item:nth-child("+(item)+")").find(".container");
                                        element.css("background","url('"+element.attr("data-src")+"')");
                                        element.css("background-size","100% 100%");
                                        var imagen = element.find(".content_top").find(".imagen img");
                                        imagen.attr("src",imagen.attr("data-src"));
                                    },100);
                                }
                            }
                        });
                        
                        container.find(".tickets a").unbind("touchstart").bind("touchstart", function(){
                            var src = decodeURIComponent($(this).attr("lang"));
                            window.plugins.ChildBrowser.showWebPage(src, { showLocationBar : true, showAddress :true, showNavigationBar : true });
                        });
                        
                        animation(container,parent);
                        
                        hideLoading();
                        parent.find(".ui-content").fadeIn("slow");
                        $('<img>').removeAttr("src");
                    });
                });
            }else{
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//SESIONES
function getSesiones(parent_id,filtro_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".ui-listview");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'sesions/mobileGetSesions/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Sesion.id;
                    var title = IDIOMA == "castellano" ? item.Sesion.title_esp : item.Sesion.title_eng;
                    var imagen = item.Sesion.imagen!=""?item.Sesion.imagen:"default.png";
                    var imagen_fondo = item.Sesion.imagen_fondo!=""?item.Sesion.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Sesion.descripcion_esp : item.Sesion.descripcion_eng;
                    
                    var class_club = 'club_'+item.Sesion.club_id;
                    
                    var html='<li class="'+class_club+'">' +
                        '<h2>'+title+'</h2>' +
                        '<a href="sesion_descripcion.html?id='+id+'"><img src="'+BASE_URL_APP+'img/sesions/'+imagen+'"/></a>' +
                        '</li>';
        		    
                    container.append(html);
        		});
                
                container.find("li:first img").load(function() {
                    //fitro de sesion
                    if(filtro_id != 0){
                        container.find("li").hide();
                        container.find("li.club_"+filtro_id).show();
                    }
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                });
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS NING&Uacute;N ITEM</p>");
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//SESIONES DESCRIPCION
function getSesionBy(parent_id, sesion_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'sesions/mobileGetSesions/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE+'/'+sesion_id, function(data) {
        
        if(data.items){
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
    		
            var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Sesion.id;
                    var url = item.Sesion.url_venta_ticket != undefined ? item.Sesion.url_venta_ticket : "";
                    var title = IDIOMA == "castellano" ? item.Sesion.title_esp : item.Sesion.title_eng;
                    var sub_title = item.Sesion.sub_title;
                    var imagen = item.Sesion.imagen!=""?item.Sesion.imagen:"default.png";
                    var imagen_redonda = item.Sesion.imagen_redonda!=""?item.Sesion.imagen_redonda:"default.png";
                    var imagen_fondo = item.Sesion.imagen_fondo!=""?item.Sesion.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Sesion.descripcion_esp : item.Sesion.descripcion_eng;
                    var direccion = item.Sesion.direccion;
                    var telefono = item.Sesion.telefono;
                    var kilomentros = item.Club.kilomentros;
                    var metros = item.Club.metros;
                    var latitud = item.Club.latitud;
                    var longitud = item.Club.longitud;
                    
                    var html='';
                    if(index == 0){
                        html+='<div class="container custom" style="background: url('+BASE_URL_APP+'img/sesions/'+imagen_fondo+');background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                            '<div class="content_top">' + 
                                '<div class="imagen left">' +
                                    '<img src="'+BASE_URL_APP+'img/sesions/' + imagen_redonda + '" />' +
                                '</div>' +
                                '<div class="title left">'+
                                    '<a class="sub toogle up" href="javascript:void(0)">' +
                                        '<h2>'+title+'</h2>' + sub_title +
                                    '</a>' +
                                '</div>' +
                            '</div>';
                    }else{
                        html+='<div class="container custom" data-src="'+BASE_URL_APP+'img/sesions/'+imagen_fondo+'" style="background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                            '<div class="content_top">' + 
                                '<div class="imagen left">' +
                                    '<img data-src="'+BASE_URL_APP+'img/sesions/' + imagen_redonda + '" src="" />' +
                                '</div>' +
                                '<div class="title left">'+
                                    '<a class="sub toogle up" href="javascript:void(0)">' +
                                        '<h2>'+title+'</h2>' + sub_title +
                                    '</a>' +
                                '</div>' +
                            '</div>';
                    }
                        html+='<div class="content_middle">' +
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
                                    '<li class="mapa"><a class="icon_mapa" href="google_map.html?latitud='+latitud+'&longitud='+longitud+'" data-icon="none" data-iconpos="top">';
                                    //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                                    if(parseInt(kilomentros) < 1){
                                        html+=parseFloat(metros).toFixed(2)+'M';
                                    }else{
                                        html+=parseFloat(kilomentros).toFixed(0)+'KM';
                                    }
                                    html+='</a>' +
                                    '</li>' +
                                    '<li class="tickets"><a class="open icon_tickets" lang="'+encodeURIComponent(url)+'" href="javascript:void(0)" data-icon="none" data-iconpos="top">Tickets</a></li>' +
                                    '<li class="alertas"><a class="icon_alertas" href="alertas.html?slug=sesiones" data-icon="none" data-iconpos="top">Alerta</a></li>' +
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
                            afterMove : function(){
                                var item = this.owl.currentItem;
                                if(item > 0){
                                    setTimeout(function(){
                                        item = parseInt(item) + 1;
                                        var element = container.find(".owl-item:nth-child("+(item)+")").find(".container");
                                        element.css("background","url('"+element.attr("data-src")+"')");
                                        element.css("background-size","100% 100%");
                                        var imagen = element.find(".content_top").find(".imagen img"); 
                                        imagen.attr("src",imagen.attr("data-src"));
                                    },100);
                                }
                            }
                        });
                        
                        container.find(".tickets a").unbind("touchstart").bind("touchstart", function(){
                            var src = decodeURIComponent($(this).attr("lang"));
                            window.plugins.ChildBrowser.showWebPage(src, { showLocationBar : true, showAddress :true, showNavigationBar : true });
                        });
                        
                        animation(container,parent);
                        
                        hideLoading();
                        parent.find(".ui-content").fadeIn("slow");
                        $('<img>').removeAttr("src");
                    });
                });
            }else{
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//PUBS
function getPubs(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".content_options");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'pubs/mobileGetPubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Pub.id;
                    var title = IDIOMA == "castellano" ? item.Pub.title_esp : item.Pub.title_eng;
                    var sub_title = item.Pub.sub_title;
                    var imagen_redonda = item.Pub.imagen_redonda!=""?item.Pub.imagen_redonda:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Pub.descripcion_esp : item.Pub.descripcion_eng;
                    var kilomentros = item.Pub.kilomentros;
                    var metros = item.Pub.metros;
                    
                    var html='<a lang="'+imagen_redonda+'" class="custom item" href="pub_descripcion.html?id='+id+'" data-role="button" data-icon="none">' +
                        '<span class="bg">' +
                            '<span class="title">'+title+'</span>' +
                            '<span class="subtitle">'+sub_title+'</span>' +
                            '<span class="km">';
                            //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                            if(parseInt(kilomentros) < 1){
                                html+=parseFloat(metros).toFixed(2)+'M';
                            }else{
                                html+=parseFloat(kilomentros).toFixed(2)+'KM';
                            }
                            html+='</span>' +
                        '</span>' +
                    '</a>';
        		    
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
                    container.find("a").each(function( index ) {
                        var cls = "itempubs"+index;
                        $(this).addClass(cls);
                        $('head').append("<style>.ui-btn-icon-left."+cls+":after{ background: url("+BASE_URL_APP+'/img/pubs/'+$(this).attr("lang")+") no-repeat scroll 0 0 transparent; }</style>");
                    });
                    
                    scrollToList(container,parent);
                    
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                });
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS NING&Uacute;N ITEM</p>");
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//PUB DESCRIPCION
function getPubBy(parent_id, pub_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'pubs/mobileGetPubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE+"/"+pub_id, function(data) {
        
        if(data.items){
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
    		
            var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Pub.id;
                    var title = IDIOMA == "castellano" ? item.Pub.title_esp : item.Pub.title_eng;
                    var sub_title = item.Pub.sub_title;
                    var imagen_redonda = item.Pub.imagen_redonda!=""?item.Pub.imagen_redonda:"default.png";
                    var imagen_fondo = item.Pub.imagen_fondo!=""?item.Pub.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Pub.descripcion_esp : item.Pub.descripcion_eng;
                    var direccion = item.Pub.direccion;
                    var telefono = item.Pub.telefono;
                    var kilomentros = item.Pub.kilomentros;
                    var metros = item.Pub.metros;
                    var latitud = item.Pub.latitud;
                    var longitud = item.Pub.longitud;
                    
                    //promos
                    var promos = item.Promo;
                    var href = '#';
                    var numero_promos = 0;
                    if(promos.length > 0){
                        $(promos).each(function(i,promo) {
                            if(promo.estado == "activo"){
                                //sacamos la ultima promocion
                                href = "promocion_descripcion.html?id="+promo.id;
                                numero_promos++;
                            }
                        });
                    }
                    
                    var html='';
                    if(index == 0){
                        html+='<div class="container custom" style="background: url('+BASE_URL_APP+'img/pubs/'+imagen_fondo+');background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/pubs/' + imagen_redonda + '" />' +
                            '</div>' +
                            '<div class="title left">'+
                                '<a class="sub toogle up" href="javascript:void(0)">' +
                                    '<h2>'+title+'</h2>' + sub_title +
                                '</a>' +
                            '</div>' +
                        '</div>';
                    }else{
                        html+='<div class="container custom" data-src="'+BASE_URL_APP+'img/pubs/'+imagen_fondo+'" style="background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                            '<div class="content_top">' + 
                                '<div class="imagen left">' +
                                    '<img data-src="'+BASE_URL_APP+'img/pubs/' + imagen_redonda + '" src="" />' +
                                '</div>' +
                                '<div class="title left">'+
                                    '<a class="sub toogle up" href="javascript:void(0)">' +
                                        '<h2>'+title+'</h2>' + sub_title +
                                    '</a>' +
                                '</div>' +
                            '</div>';
                    }
                        html+='<div class="content_middle">' +
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
                                    '<li class="mapa"><a class="icon_mapa" href="google_map.html?latitud='+latitud+'&longitud='+longitud+'" data-icon="none" data-iconpos="top">';
                                    //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                                    if(parseInt(kilomentros) < 1){
                                        html+=parseFloat(metros).toFixed(2)+'M';
                                    }else{
                                        html+=parseFloat(kilomentros).toFixed(0)+'KM';
                                    }
                                    html+='</a>' +
                                    '</li>' +
                                    '<li class="promos"><a class="icon_promos" href="'+href+'" data-icon="none" data-iconpos="top">Promos</a><span class="numero">'+numero_promos+'</span></li>' +
                                    '<li class="alertas"><a class="icon_alertas" href="alertas.html?slug=pubs" data-icon="none" data-iconpos="top">Alerta</a></li>' +
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
                            afterMove : function(){
                                var item = this.owl.currentItem;
                                if(item > 0){
                                    setTimeout(function(){
                                        item = parseInt(item) + 1;
                                        var element = container.find(".owl-item:nth-child("+(item)+")").find(".container");
                                        element.css("background","url('"+element.attr("data-src")+"')");
                                        element.css("background-size","100% 100%");
                                        var imagen = element.find(".content_top").find(".imagen img"); 
                                        imagen.attr("src",imagen.attr("data-src"));
                                    },100);
                                }
                            }
                        });
                        
                        animation(container,parent);
                        
                        hideLoading();
                        parent.find(".ui-content").fadeIn("slow");
                        $('<img>').removeAttr("src");
                    });
                });
            }else{
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//BEACHCLUBS
function getBeachclubs(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".content_options");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'beachclubs/mobileGetBeachclubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Beachclub.id;
                    var title = IDIOMA == "castellano" ? item.Beachclub.title_esp : item.Beachclub.title_eng;
                    var sub_title = item.Beachclub.sub_title;
                    var imagen_redonda = item.Beachclub.imagen_redonda!=""?item.Beachclub.imagen_redonda:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Beachclub.descripcion_esp : item.Beachclub.descripcion_eng;
                    var kilomentros = item.Beachclub.kilomentros;
                    var metros = item.Beachclub.metros;
                    
                    var html='<a lang="'+imagen_redonda+'" class="custom item" href="beachclubs_descripcion.html?id='+id+'" data-role="button" data-icon="none">' +
                        '<span class="bg">' +
                            '<span class="title">'+title+'</span>' +
                            '<span class="subtitle">'+sub_title+'</span>' +
                            '<span class="km">';
                            //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                            if(parseInt(kilomentros) < 1){
                                html+=parseFloat(metros).toFixed(2)+'M';
                            }else{
                                html+=parseFloat(kilomentros).toFixed(2)+'KM';
                            }
                            html+='</span>' +
                        '</span>' +
                    '</a>';
        		    
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
                    container.find("a").each(function( index ) {
                        var cls = "itembeachclubs"+index;
                        $(this).addClass(cls);
                        $('head').append("<style>.ui-btn-icon-left."+cls+":after{ background: url("+BASE_URL_APP+'/img/beachclubs/'+$(this).attr("lang")+") no-repeat scroll 0 0 transparent; }</style>");
                    });
                    
                    scrollToList(container,parent);
                    
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                });
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS NING&Uacute;N ITEM</p>");
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//BEACHCLUBS DESCRIPCION
function getBeachclubBy(parent_id, beachclub_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'beachclubs/mobileGetBeachclubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE+"/"+beachclub_id, function(data) {
        
        if(data.items){
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
    		
            var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Beachclub.id;
                    var title = IDIOMA == "castellano" ? item.Beachclub.title_esp : item.Beachclub.title_eng;
                    var sub_title = item.Beachclub.sub_title;
                    var imagen_redonda = item.Beachclub.imagen_redonda!=""?item.Beachclub.imagen_redonda:"default.png";
                    var imagen_fondo = item.Beachclub.imagen_fondo!=""?item.Beachclub.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Beachclub.descripcion_esp : item.Beachclub.descripcion_eng;
                    var direccion = item.Beachclub.direccion;
                    var telefono = item.Beachclub.telefono;
                    var kilomentros = item.Beachclub.kilomentros;
                    var metros = item.Beachclub.metros;
                    var latitud = item.Beachclub.latitud;
                    var longitud = item.Beachclub.longitud;
                    
                    //promos
                    var promos = item.Promo;
                    var href = '#';
                    var numero_promos = 0;
                    if(promos.length > 0){
                        $(promos).each(function(i,promo) {
                            if(promo.estado == "activo"){
                                //sacamos la ultima promocion
                                href = "promocion_descripcion.html?id="+promo.id;
                                numero_promos++;
                            }
                        });
                    }
                    
                    var html='';
                    if(index == 0){
                        html+='<div class="container custom" style="background: url('+BASE_URL_APP+'img/beachclubs/'+imagen_fondo+');background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/beachclubs/' + imagen_redonda + '" />' +
                            '</div>' +
                            '<div class="title left">'+
                                '<a class="sub toogle up" href="javascript:void(0)">' +
                                    '<h2>'+title+'</h2>' + sub_title +
                                '</a>' +
                            '</div>' +
                        '</div>';
                    }else{
                        html+='<div class="container custom" data-src="'+BASE_URL_APP+'img/beachclubs/'+imagen_fondo+'" style="background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                            '<div class="content_top">' + 
                                '<div class="imagen left">' +
                                    '<img data-src="'+BASE_URL_APP+'img/beachclubs/' + imagen_redonda + '" src="" />' +
                                '</div>' +
                                '<div class="title left">'+
                                    '<a class="sub toogle up" href="javascript:void(0)">' +
                                        '<h2>'+title+'</h2>' + sub_title +
                                    '</a>' +
                                '</div>' +
                            '</div>';
                    }
                        html+='<div class="content_middle">' +
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
                                    '<li class="mapa"><a class="icon_mapa" href="google_map.html?latitud='+latitud+'&longitud='+longitud+'" data-icon="none" data-iconpos="top">';
                                    //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                                    if(parseInt(kilomentros) < 1){
                                        html+=parseFloat(metros).toFixed(2)+'M';
                                    }else{
                                        html+=parseFloat(kilomentros).toFixed(0)+'KM';
                                    }
                                    html+='</a>' +
                                    '</li>' +
                                    '<li class="promos"><a class="icon_promos" href="'+href+'" data-icon="none" data-iconpos="top">Promos</a><span class="numero">'+numero_promos+'</span></li>' +
                                    '<li class="alertas"><a class="icon_alertas" href="alertas.html?slug=beachclubs" data-icon="none" data-iconpos="top">Alerta</a></li>' +
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
                            afterMove : function(){
                                var item = this.owl.currentItem;
                                if(item > 0){
                                    setTimeout(function(){
                                        item = parseInt(item) + 1;
                                        var element = container.find(".owl-item:nth-child("+(item)+")").find(".container");
                                        element.css("background","url('"+element.attr("data-src")+"')");
                                        element.css("background-size","100% 100%");
                                        var imagen = element.find(".content_top").find(".imagen img"); 
                                        imagen.attr("src",imagen.attr("data-src"));
                                    },100);
                                }
                            }
                        });
                        
                        animation(container,parent);
                        
                        hideLoading();
                        parent.find(".ui-content").fadeIn("slow");
                        $('<img>').removeAttr("src");
                    });
                });
            }else{
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//FESTIVALES
function getFestivales(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".content_options");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'festivals/mobileGetFestivales/'+LATITUDE+"/"+LONGITUDE, function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Festival.id;
                    var title = IDIOMA == "castellano" ? item.Festival.title_esp : item.Festival.title_eng;
                    var sub_title = item.Festival.sub_title;
                    var imagen_redonda = item.Festival.imagen_redonda!=""?item.Festival.imagen_redonda:"default.png";
                    var kilomentros = item.Festival.kilomentros;
                    var metros = item.Festival.metros
                    
                    var html='<a lang="'+imagen_redonda+'" class="custom item" href="festivales_descripcion.html?id='+id+'" data-role="button" data-icon="none">' +
                        '<span class="bg">' +
                            '<span class="title">'+title+'</span>' +
                            '<span class="subtitle">'+sub_title+'</span>' +
                            '<span class="km">';
                            //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                            if(parseInt(kilomentros) < 1){
                                html+=parseFloat(metros).toFixed(2)+'M';
                            }else{
                                html+=parseFloat(kilomentros).toFixed(2)+'KM';
                            }
                            html+='</span>' +
                        '</span>' +
                    '</a>';
        		    
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
                    container.find("a").each(function( index ) {
                        var cls = "itemfestival"+index;
                        $(this).addClass(cls);
                        $('head').append("<style>.ui-btn-icon-left."+cls+":after{ background: url("+BASE_URL_APP+'/img/festivals/'+$(this).attr("lang")+") no-repeat scroll 0 0 transparent; }</style>");
                    });
                    
                    scrollToList(container,parent);
                    
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                });
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS NING&Uacute;N ITEM</p>");
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//FESTIVALES DESCRIPCION
function getFestivalBy(parent_id, festival_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'festivals/mobileGetFestivales/'+LATITUDE+"/"+LONGITUDE+"/"+festival_id, function(data) {
        
        if(data.items){
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
    		
            var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Festival.id;
                    var title = IDIOMA == "castellano" ? item.Festival.title_esp : item.Festival.title_eng;
                    var sub_title = item.Festival.sub_title;
                    var imagen_redonda = item.Festival.imagen_redonda!=""?item.Festival.imagen_redonda:"default.png";
                    var imagen_fondo = item.Festival.imagen_fondo!=""?item.Festival.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Festival.descripcion_esp : item.Festival.descripcion_eng;
                    var kilomentros = item.Festival.kilomentros;
                    var metros = item.Festival.metros;
                    var latitud = item.Festival.latitud;
                    var longitud = item.Festival.longitud;
                    
                    var html='';
                    if(index == 0){
                        html+='<div class="container custom2" style="background: url('+BASE_URL_APP+'img/festivals/'+imagen_fondo+');background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/festivals/' + imagen_redonda + '" />' +
                            '</div>' +
                            '<div class="title left">'+
                                '<a class="sub toogle up" href="javascript:void(0)">' +
                                    '<h2>'+title+'</h2>' + sub_title +
                                '</a>' +
                            '</div>' +
                        '</div>';
                    }else{
                        html+='<div class="container custom2" data-src="'+BASE_URL_APP+'img/festivals/'+imagen_fondo+'" style="background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                            '<div class="content_top">' + 
                                '<div class="imagen left">' +
                                    '<img data-src="'+BASE_URL_APP+'img/festivals/' + imagen_redonda + '" src="" />' +
                                '</div>' +
                                '<div class="title left">'+
                                    '<a class="sub toogle up" href="javascript:void(0)">' +
                                        '<h2>'+title+'</h2>' + sub_title +
                                    '</a>' +
                                '</div>' +
                            '</div>';
                    }
                        html+='<div class="content_middle">' +
                            '<p class="descripcion">' + descripcion +'</p>' +
                        '</div>' +
                        '<div class="content_bottom">' +
                            '<div data-role="navbar" data-corners="false">'+
                                '<ul class="nav_options">' +
                                    '<li class="mapa"><a class="icon_mapa" href="google_map.html?latitud='+latitud+'&longitud='+longitud+'" data-icon="none" data-iconpos="top">';
                                    //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                                    if(parseInt(kilomentros) < 1){
                                        html+=parseFloat(metros).toFixed(2)+'M';
                                    }else{
                                        html+=parseFloat(kilomentros).toFixed(0)+'KM';
                                    }
                                    html+='</a>' +
                                    '</li>' +
                                    '<li class="alertas"><a class="icon_alertas" href="alertas.html?slug=festivales" data-icon="none" data-iconpos="top">Alerta</a></li>' +
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
                            afterMove : function(){
                                var item = this.owl.currentItem;
                                if(item > 0){
                                    setTimeout(function(){
                                        item = parseInt(item) + 1;
                                        var element = container.find(".owl-item:nth-child("+(item)+")").find(".container");
                                        element.css("background","url('"+element.attr("data-src")+"')");
                                        element.css("background-size","100% 100%");
                                        var imagen = element.find(".content_top").find(".imagen img"); 
                                        imagen.attr("src",imagen.attr("data-src"));
                                    },100);
                                }
                            }
                        });
                        
                        animation(container,parent);
                        
                        hideLoading();
                        parent.find(".ui-content").fadeIn("slow");
                        $('<img>').removeAttr("src");
                    });
                });
            }else{
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//DJS
function getDjs(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".content_options");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'djs/mobileGetDjs', function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Dj.id;
                    var title = IDIOMA == "castellano" ? item.Dj.title_esp : item.Dj.title_eng;
                    var imagen_redonda = item.Dj.imagen_redonda!=""?item.Dj.imagen_redonda:"default.png";
                    
                    var html='<a id="'+id+'" lang="'+imagen_redonda+'" class="custom item" href="dj_descripcion.html?id='+id+'" data-role="button" data-icon="none">' +
                        '<span class="bg title">'+title+'</span>' +
                    '</a>';
        		    
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
                    container.find("a").each(function( index ) {
                        var cls = "itemdj"+$(this).attr("id")+index;
                        $(this).addClass(cls);
                        $('head').append("<style>.ui-btn-icon-left."+cls+":after{ background: url("+BASE_URL_APP+'/img/djs/'+$(this).attr("lang")+") no-repeat scroll 0 0 transparent; }</style>");
                    });
                    
                    scrollToList(container,parent);
                    
                    //cargamos dinamicamente mas items
                    var mas_items = true;
                    container.parent().endlessScroll({
                        content: function(i, p, d) {
                            if(d == "next" && mas_items){
                                showLoading();
                            }
                            return mas_items;
                        },
                        callback :function(i, p, d){
                            if(d == "next"){
                                var indice = container.find("a").length;
                                $.getJSON(BASE_URL_APP + 'djs/ajax/'+indice, function(data) {
                                    var items = data.items;
                                    if(items.length){
                                		$.each(items, function(index, item) {
                                            var id = item.Dj.id;
                                            var title = IDIOMA == "castellano" ? item.Dj.title_esp : item.Dj.title_eng;
                                            var imagen_redonda = item.Dj.imagen_redonda!=""?item.Dj.imagen_redonda:"default.png";
                                            
                                            var html='<a id="'+id+'" lang="'+imagen_redonda+'" class="custom item" href="dj_descripcion.html?id='+id+'" data-role="button" data-icon="none">' +
                                                '<span class="bg title">'+title+'</span>' +
                                            '</a>';
                                            container.append(html);
                                		});                                        
                                    }else{
                                        mas_items = false;
                                    }
                                    
                                    container.promise().done(function() {
                                        container.trigger("create");
                                        container.find("a").each(function( index ) {
                                            var cls = "itemdj"+$(this).attr("id")+index;
                                            $(this).addClass(cls);
                                            $('head').append("<style>.ui-btn-icon-left."+cls+":after{ background: url("+BASE_URL_APP+'/img/djs/'+$(this).attr("lang")+") no-repeat scroll 0 0 transparent; }</style>");
                                        });
                                        
                                        hideLoading();
                                    });
                                });
                            }
                        }
                    });                    
                    
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                });
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS NING&Uacute;N ITEM</p>");
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//DJ DESCRIPCION
function getDjBy(parent_id, dj_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'djs/mobileGetDjs/'+dj_id, function(data) {
        
        if(data.items){
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
    		
            var items = data.items;
            if(items.length){
                $.each(items, function(index, item) {
                    var id = item.Dj.id;
                    var title = IDIOMA == "castellano" ? item.Dj.title_esp : item.Dj.title_eng;
                    var imagen_redonda = item.Dj.imagen_redonda!=""?item.Dj.imagen_redonda:"default.png";
                    var imagen_fondo = item.Dj.imagen_fondo!=""?item.Dj.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Dj.descripcion_esp : item.Dj.descripcion_eng;
                    
                    var html='<div id="'+id+'" class="container custom3" style="background: url('+BASE_URL_APP+'img/djs/'+imagen_fondo+');background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/djs/' + imagen_redonda + '" />' +
                            '</div>' +
                            '<div class="title left">'+
                                '<a class="sub toogle up" href="javascript:void(0)">' +
                                    '<h2>'+title+'</h2> &nbsp;' +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="content_middle">' +
                            '<p class="descripcion">' + descripcion +'</p>' +
                        '</div>' +
                        '<div class="content_bottom">' +
                            '<div data-role="navbar" data-corners="false">'+
                                '<ul class="nav_options">' +
                                    '<li class="alertas"><a class="icon_alertas" href="alertas.html?slug=djs" data-icon="none" data-iconpos="top">Alerta</a></li>' +
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
                            afterMove : function(){
                                var currentItem = this.owl.currentItem + 1;
                                if (currentItem === this.owl.owlItems.length) {
                            	    $.getJSON(BASE_URL_APP + 'djs/mobileGetDjs/'+dj_id+"/"+currentItem, function(result) {
                            	        var resultados = result.items;
                                        if(resultados.length){
                                            showLoading();
                                            
                                            $(resultados).each(function(index, item){
                                                var id = item.Dj.id;
                                                var title = IDIOMA == "castellano" ? item.Dj.title_esp : item.Dj.title_eng;
                                                var imagen_redonda = item.Dj.imagen_redonda!=""?item.Dj.imagen_redonda:"default.png";
                                                var imagen_fondo = item.Dj.imagen_fondo!=""?item.Dj.imagen_fondo:"default.png";
                                                var descripcion = IDIOMA == "castellano" ? item.Dj.descripcion_esp : item.Dj.descripcion_eng;
                                                
                                                var html='<div id="'+id+'" class="container custom3" style="background: url('+BASE_URL_APP+'img/djs/'+imagen_fondo+');background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                                                    '<div class="content_top">' + 
                                                        '<div class="imagen left">' +
                                                            '<img src="'+BASE_URL_APP+'img/djs/' + imagen_redonda + '" />' +
                                                        '</div>' +
                                                        '<div class="title left">'+
                                                            '<a class="sub toogle up" href="javascript:void(0)">' +
                                                                '<h2>'+title+'</h2> &nbsp;' +
                                                            '</a>' +
                                                        '</div>' +
                                                    '</div>' +
                                                    '<div class="content_middle">' +
                                                        '<p class="descripcion">' + descripcion +'</p>' +
                                                    '</div>' +
                                                    '<div class="content_bottom">' +
                                                        '<div data-role="navbar" data-corners="false">'+
                                                            '<ul class="nav_options">' +
                                                                '<li class="alertas"><a class="icon_alertas" href="alertas.html?slug=djs" data-icon="none" data-iconpos="top">Alerta</a></li>' +
                                                            '</ul>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>';
                                                
                                                if(container.find(".owl-item #"+id).html() == undefined){
                                                    container.data('owlCarousel').addItem(html);
                                                }
                                            });
                                                                                         
                                            owl = container.data('owlCarousel');
                                            owl.jumpTo(currentItem-1);
                                            
                                            container.promise().done(function() {
                                                //refresh
                                        		$('[data-role="navbar"]').navbar();
                                                animation(container,parent);
                                                hideLoading();
                                            });
                                        }
                                	});
                                }                                
                            }
                        });
                        
                        animation(container,parent);
                        
                        hideLoading();
                        parent.find(".ui-content").fadeIn("slow");
                        $('<img>').removeAttr("src");
                    });
                });
            }else{
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//PROMOCIONES
function getPromociones(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".content_options");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'promos/mobileGetPromociones/'+LATITUDE+"/"+LONGITUDE+"/"+CIUDAD_ID, function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
            
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    var id = item.Promo.id;
                    var title = IDIOMA == "castellano" ? item.Promo.title_esp : item.Promo.title_eng;
                    var sub_title = item.Promo.sub_title;
                    var imagen_redonda = item.Promo.imagen_redonda!=""?item.Promo.imagen_redonda:"default.png";
                    var kilomentros = item.Promo.kilomentros;
                    var metros = item.Promo.metros;
                    
                    var html='<a lang="'+imagen_redonda+'" class="custom item" href="promocion_descripcion.html?id='+id+'" data-role="button" data-icon="none">' +
                        '<span class="bg">' +
                            '<span class="title">'+title+'</span>' +
                            '<span class="subtitle">'+sub_title+'</span>' +
                            '<span class="km">';
                            //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                            if(parseInt(kilomentros) < 1){
                                html+=parseFloat(metros).toFixed(2)+'M';
                            }else{
                                html+=parseFloat(kilomentros).toFixed(2)+'KM';
                            }
                            html+='</span>' +
                        '</span>' +
                    '</a>';
        		    
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
                    container.find("a").each(function( index ) {
                        var cls = "itempromo"+index;
                        $(this).addClass(cls);
                        $('head').append("<style>.ui-btn-icon-left."+cls+":after{ background: url("+BASE_URL_APP+'/img/promos/'+$(this).attr("lang")+") no-repeat scroll 0 0 transparent; }</style>");
                    });
                    
                    scrollToList(container,parent);
                    
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                });
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS NING&Uacute;N ITEM</p>");
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//PROMOCION DESCRIPCION
function getPromocionBy(parent_id, promocion_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".owl-carousel");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'promos/mobileGetPromociones/'+LATITUDE+"/"+LONGITUDE+"/"+CIUDAD_ID, function(data) {
	    var goto_index = 0;
        
        if(data.items){
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
    		
            var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    
                    //vemos a que item deber ir
                    if(item.Promo.id == promocion_id){
                        goto_index = index;
                    }
                    
                    var id = item.Promo.id;
                    var title = IDIOMA == "castellano" ? item.Promo.title_esp : item.Promo.title_eng;
                    var sub_title = item.Promo.sub_title;
                    var imagen_redonda = item.Promo.imagen_redonda!=""?item.Promo.imagen_redonda:"default.png";
                    var imagen_fondo = item.Promo.imagen_fondo!=""?item.Promo.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Promo.descripcion_esp : item.Promo.descripcion_eng;
                    var direccion = item.Promo.direccion;
                    var telefono = item.Promo.telefono;
                    var kilomentros = item.Promo.kilomentros;
                    var metros = item.Promo.metros;
                    var latitud = item.Promo.latitud;
                    var longitud = item.Promo.longitud;
                    
                    var html='<div class="container custom2" style="background: url('+BASE_URL_APP+'img/promos/'+imagen_fondo+');background-size: 100% 100%;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/promos/' + imagen_redonda + '" />' +
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
                                    '<li class="mapa"><a class="icon_mapa" href="google_map.html?latitud='+latitud+'&longitud='+longitud+'" data-icon="none" data-iconpos="top">';
                                    //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                                    if(parseInt(kilomentros) < 1){
                                        html+=parseFloat(metros).toFixed(2)+'M';
                                    }else{
                                        html+=parseFloat(kilomentros).toFixed(0)+'KM';
                                    }
                                    html+='</a>' +
                                    '</li>' +
                                    '<li class="alertas"><a class="icon_alertas" href="alertas.html?slug=promos" data-icon="none" data-iconpos="top">Alerta</a></li>' +
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
                        
                        hideLoading();
                        parent.find(".ui-content").fadeIn("slow");
                        $('<img>').removeAttr("src");
                    });
                });
            }else{
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//TICKET DESCRIPCION
function getTicketSesionBy(parent_id, ticket_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".container");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'tickets/mobileGetTicketSesionBy/'+ticket_id, function(data) {
        
        if(data.item){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != "" && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
            var info = data.info;
    		var item = data.item;
            if(item != ""){
                    
                    var ticket_id = item.Ticket.id;
                    var url = item.Sesion.url_venta_ticket != undefined ? item.Sesion.url_venta_ticket : "";
                    var title = IDIOMA == "castellano" ? item.Sesion.title_esp : item.Sesion.title_eng;
                    var djs = item.Dj;
                    var djs_titles = "";
                    $(djs).each(function(i,dj) {
                        djs_titles+= IDIOMA == "castellano" ? dj.title_esp : dj.title_eng;
                        if($(djs).length != (i+1)) djs_titles+= ", ";
                    });
                    var imagen_redonda = item.Sesion.imagen_redonda!=""?item.Sesion.imagen_redonda:"default.png";
                    var precio = parseInt(item.Ticket.precio) > 0 ? item.Ticket.precio : 0;
                    var fecha_ini = item.Ticket.fecha_ini_virtual;
                    
                    container.find("h3").html(title);
                    container.find("img").attr("src",BASE_URL_APP+'img/sesions/'+imagen_redonda);
                    container.find(".fecha").html(fecha_ini);
                    container.find(".djs").html(djs_titles);
                    container.find(".precio").html(precio+"&euro;");
                    if(precio == 0) container.find(".precio").hide();
                    
                    //valor
                    var numero = container.find(".numero").html();
                    container.find(".total").html(parseInt(precio) * parseInt(numero));
                    
                    container.find(".divisores a.sumar").unbind("touchstart").bind("touchstart", function(){
                        var numero = container.find(".numero").html();
                        container.find(".numero").html(parseInt(numero) + 1);
                        var total = parseInt(precio) * parseInt(container.find(".numero").html());
                        container.find(".total").html(total);
                    });
                    
                    container.find(".divisores a.restar").unbind("touchstart").bind("touchstart", function(){
                        var numero = container.find(".numero").html();
                        if(parseInt(container.find(".numero").html()) != 1){
                            container.find(".numero").html(parseInt(numero) - 1);
                            var total = parseInt(precio) * parseInt(container.find(".numero").html());
                            container.find(".total").html(total);
                        }
                    });
                    
                    //comprar
                    container.find("#realizar_compra").attr("lang",encodeURIComponent(url));
                    
                    container.find("#realizar_compra").unbind("touchstart").bind("touchstart", function(){
                        var src = decodeURIComponent($(this).attr("lang"));
                        window.plugins.ChildBrowser.showWebPage(src, { showLocationBar : true, showAddress :true, showNavigationBar : true });
                    });
                    
                    parent.find(".container_popup .castellano").html(info.Sistema.text_esp)
                    parent.find(".container_popup .english").html(info.Sistema.text_eng)
                    
                    //mostramos la info segun al idioma
                    parent.find(".container_popup ."+IDIOMA).show();
                    
                    //scroll
                    scrollToList(parent,parent);
                    
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
            }else{
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}

//ALERTAS
function getAlertas(parent_id, slug){
    //si no esta logeado no puede hacer nada, por eso colocamos los valores vacio
    var usuario_id = "";
    if(isLogin()) usuario_id = COOKIE.id;
    var parent = $("#"+parent_id);
    var container = parent.find(".content_options");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'alertas/mobileGetAlertas/'+CIUDAD_ID+"/"+usuario_id+"/"+slug+"/0/8", function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
            }
            
            //verificamos que el usuario este logeado
            if(!isLogin()) data.items = "";
            var info = data.info;
    		var items = data.items;
            if($(items).size()){
        		$.each(items, function(index, item) {
        		    var clase = index;
                    var c ='<div class="'+clase+' item">';
                    $.each(item, function(i, t) {
                        var lang = clase+","+t.id;
                        if(index == "sesiones") index = "sesions";
                        if(index == "festivales") index = "festivals";
                        var title = IDIOMA == "castellano" ? t.title_esp : t.title_eng;
                        var imagen_redonda = t.imagen_redonda!=""?t.imagen_redonda:"default.png";
                        var activado = t.activado;
                        var on = "";
                        var off = "";
                        if(activado == "on"){
                            on = 'selected="selected"';
                        }else if(activado == "off"){
                            off = 'selected="selected"';
                        }
                        var cls = "al"+index+i;
                        if(clase == "pubs" || clase == "promos"){
                            title = IDIOMA == "castellano" ? "Recibir alertas" : "Receive alerts";
                        }
                        c+='<a class="custom '+cls+' item" href="javascript:void(0)" data-role="button" data-icon="none" lang="'+lang+'">' +
                                '<span class="bglista title">'+title+'</span>' +
                                '<select name="flip-mini" data-role="slider" data-mini="true">' +
	                               '<option value="off" '+off+'>Off</option>' +
	                               '<option value="on" '+on+'>On</option>' +
                                '</select>' +
                            '</a>';
                    });
                    c +='</div>'
                    container.append(c);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
            		$.each(items, function(index, item) {
                        if(index == "sesiones") index = "sesions";
                        if(index == "festivales") index = "festivals";
                        $.each(item, function(i, t) {
                            var cls = "al"+index+i;
                            var imagen_redonda = t.imagen_redonda!=""?t.imagen_redonda:"default.png";
                            var css = "";
                            if(index == "pubs" || index == "promos"){
                                imagen_redonda = "alerta_default.png";
                                css = "background-color:#000;";
                            }
                            $('head').append("<style>.ui-btn-icon-left."+cls+":after{ background: url("+BASE_URL_APP+'img/'+index+'/'+imagen_redonda+") no-repeat scroll 0 0 transparent; "+css+"}</style>");
                        });
            		});
                    
                    scrollToList(container,parent);	
                    
                    parent.find(".container_popup .castellano").html(info.Sistema.text_esp);
                    parent.find(".container_popup .english").html(info.Sistema.text_eng);
                    //mostramos la info segun al idioma
                    parent.find(".container_popup ."+IDIOMA).show();
                    
                    container.find("div.item").hide();
                    container.find("div.item."+slug).show();
                    
                    //recibir/dejar de recibir alertas
                    container.find("select").change(function(){
                        var lang = $(this).parent().attr("lang");
                        lang = lang.split(",");
                        var tipo = lang[0];
                        var tipo_id = lang[1];
                        var activado = $(this).val() == "on" ? 1 : 0;
                    	
                        $.getJSON(BASE_URL_APP + 'usuarios_alertas/mobileSaveAlertas/'+usuario_id+"/"+tipo_id+"/"+tipo+"/"+activado, function(data) {
                            if(data){
                                //ocultamos loading
                                $.mobile.loading( 'hide' );
                                
                                if(data.success){
                                    //showAlert(data.mensaje, "Aviso", "Aceptar");
                                }else{
                                    //showAlert(data.mensaje, "Error", "Aceptar");
                                }
                            }
                    	});
                    });
                    
                    //cargamos dinamicamente mas items
                    loadMoreItems(container, usuario_id);
                    
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                });
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS NING&Uacute;N ITEM</p>");
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
    
}

//GUEST LIST
function getGuesList(parent_id,club_id){
    //si no esta logeado no puede hacer nada, por eso colocamos los valores vacio
    var usuario_id = "";
    if(isLogin()) usuario_id = COOKIE.id;
    var parent = $("#"+parent_id);
    var container = parent.find(".ui-listview");
    parent.find(".ui-content").hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'sesions/mobileGetGuesList/'+CIUDAD_ID+"/"+usuario_id, function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                parent.find(".ui-header").find(".page h2").html(titulo);
                if(IDIOMA == "castellano") parent.find(".ui-header").find(".page h2").addClass("small");
            }
            
            //verificamos que el usuario este logeado
            if(!isLogin()) data.items = "";
    		var items = data.items;
            if($(items).size()){
        		$.each(items, function(index, item) {
                    var id = item.Sesion.id;
                    var date = data.fecha;
                    var class_club = 'club_'+item.Sesion.club_id;
                    var title = IDIOMA == "castellano" ? item.Sesion.title_esp : item.Sesion.title_eng;
                    var imagen_redonda = item.Sesion.imagen_redonda!=""?item.Sesion.imagen_redonda:"default.png";
                    var cls = "guest_"+index+id;
                    var apuntarme = IDIOMA == "castellano" ? "APUNTARME" : "SING UP";
                    
                    var html='<li class="'+class_club+'">' +
                            '<a class="custom '+cls+' item" href="javascript:void(0)" data-role="button" data-icon="none">' +
                                '<span class="info">' +
                                    '<span class="title">'+title+'</span>' +
                                    '<span class="fecha">'+date+'</span>' +
                                '</span>' +
                                '<button>'+apuntarme+'</button>' +
                            '</a>' +
                        '</li>';
                        
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
            		$.each(items, function(index, item){ 
                        var id = item.Sesion.id;
                        var imagen_redonda = item.Sesion.imagen_redonda!=""?item.Sesion.imagen_redonda:"default.png";
                        var cls = "guest_"+index+id;
                        $('head').append("<style>.ui-btn-icon-left."+cls+":after{ background: url("+BASE_URL_APP+'img/sesions/'+imagen_redonda+") no-repeat scroll 0 0 transparent;}</style>");
            		});
                    
                    scrollToList(container,parent);	
                    
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
                });
                
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS NING&Uacute;N ITEM</p>");
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});    
    
}

//VENTA
function loadIframe(parent_id, url, prev_page_id){
    var parent = $("#"+parent_id);
    var container = parent.find("iframe");
    if(url != ""){
        showLoading();
        container.attr("src",decodeURIComponent(url));
        container.load(function(){
            hideLoading();
            //autofitIframe(this);
            if(prev_page_id == "club_descripcion"){
                $(parent).find(".wrap").css("height", "976px");
                $(parent).find("iframe").css("height", "2980px");
            }else if(prev_page_id == "sesion_descripcion" || prev_page_id == "ticket_descripcion"){
                
            }
        });
    }
}