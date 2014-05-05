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
    getMenu(page_id);
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
    var parent = $("#"+page_id);
    parent.find(".datepicker").parent().hide();
});

//TICKET DESCRIPCION
$(document).on("pagebeforeshow","#ticket_descripcion",function(event){
    var page_id = $(this).attr("id");
    var ticket_id = getUrlVars()["ticket_id"];
    getTicketSesionBy(page_id, ticket_id);
});

//GOOGLE MAP
$(document).on('pagebeforeshow',"#google_map", function(event, ui) {
    var page_id = $(this).attr("id");
    showGoogleMap(page_id, getUrlVars()["latitud"],getUrlVars()["longitud"]);
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
function getMenu(parent_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".ui-content");
    container.hide();
    
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'sistemas/mobileGetMenu', function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                parent.css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                parent.css("background-size","100% 100%");
            }
    		
            var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
                    var id = item.Sistema.id;
                    var title = IDIOMA == "castellano" ? item.Sistema.title_esp : item.Sistema.title_eng;
                    container.find(".icon"+id).text(title);
        		});
                                
                container.promise().done(function() {
                    hideLoading();
                    container.fadeIn("slow");
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
                                
                container.find("li:last img").load(function() {
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
    
	$.getJSON(BASE_URL_APP + 'clubs/mobileGetClubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
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
                    var kilomentros = item.Club.kilomentros;
                    var metros = item.Club.metros;
                    var latitud = item.Club.latitud;
                    var longitud = item.Club.longitud;
                    
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
                                    '<li class="mapa"><a class="icon_mapa" href="google_map.html?latitud='+latitud+'&longitud='+longitud+'" data-icon="none" data-iconpos="top">';
                                    //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                                    if(parseInt(kilomentros) < 1){
                                        html+=parseFloat(metros).toFixed(2)+'M';
                                    }else{
                                        html+=parseFloat(kilomentros).toFixed(0)+'KM';
                                    }
                                    html+='</a>' +
                                    '</li>' +
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
function getSesiones(parent_id){
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
                    
                    var html='<li>' +
                        '<h2>'+title+'</h2>' +
                        '<a href="sesion_descripcion.html?id='+id+'"><img src="'+BASE_URL_APP+'img/sesions/'+imagen+'"/></a>' +
                        '</li>';
        		    
                    container.append(html);
        		});
                
                container.find("li:last img").load(function() {
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
    
	$.getJSON(BASE_URL_APP + 'sesions/mobileGetSesions/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
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
                    var kilomentros = item.Club.kilomentros;
                    var metros = item.Club.metros;
                    var latitud = item.Club.latitud;
                    var longitud = item.Club.longitud;
                    
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
                                    '<li class="mapa"><a class="icon_mapa" href="google_map.html?latitud='+latitud+'&longitud='+longitud+'" data-icon="none" data-iconpos="top">';
                                    //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                                    if(parseInt(kilomentros) < 1){
                                        html+=parseFloat(metros).toFixed(2)+'M';
                                    }else{
                                        html+=parseFloat(kilomentros).toFixed(0)+'KM';
                                    }
                                    html+='</a>' +
                                    '</li>' +
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
    
	$.getJSON(BASE_URL_APP + 'pubs/mobileGetPubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
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
                    if(item.Pub.id == pub_id){
                        goto_index = index;
                    }
                    
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
                    
                    var html='<div class="container custom" style="background: url('+BASE_URL_APP+'img/pubs/'+imagen_fondo+');background-size: 100% auto;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/pubs/' + imagen_redonda + '" />' +
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
                                    '<li class="promos"><a class="icon_promos" href="#" data-icon="none" data-iconpos="top">Promos</a></li>' +
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
    
	$.getJSON(BASE_URL_APP + 'beachclubs/mobileGetBeachclubs/'+CIUDAD_ID+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
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
                    if(item.Beachclub.id == beachclub_id){
                        goto_index = index;
                    }
                    
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
                    
                    var html='<div class="container custom" style="background: url('+BASE_URL_APP+'img/beachclubs/'+imagen_fondo+');background-size: 100% auto;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/beachclubs/' + imagen_redonda + '" />' +
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
                                    '<li class="promos"><a class="icon_promos" href="#" data-icon="none" data-iconpos="top">Promos</a></li>' +
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
    
	$.getJSON(BASE_URL_APP + 'festivals/mobileGetFestivales/'+LATITUDE+"/"+LONGITUDE, function(data) {
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
                    if(item.Festival.id == festival_id){
                        goto_index = index;
                    }
                    
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
                    
                    var html='<div class="container custom" style="background: url('+BASE_URL_APP+'img/festivals/'+imagen_fondo+');background-size: 100% auto;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/festivals/' + imagen_redonda + '" />' +
                            '</div>' +
                            '<div class="title left">'+
                                '<a class="sub toogle up" href="javascript:void(0)">' +
                                    '<h2>'+title+'</h2>' + sub_title +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="content_middle">' +
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
                    
                    var html='<a lang="'+imagen_redonda+'" class="custom item" href="dj_descripcion.html?id='+id+'" data-role="button" data-icon="none">' +
                        '<span class="bg title">'+title+'</span>' +
                    '</a>';
        		    
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
                    container.find("a").each(function( index ) {
                        var cls = "itemdj"+index;
                        $(this).addClass(cls);
                        $('head').append("<style>.ui-btn-icon-left."+cls+":after{ background: url("+BASE_URL_APP+'/img/djs/'+$(this).attr("lang")+") no-repeat scroll 0 0 transparent; }</style>");
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
    
	$.getJSON(BASE_URL_APP + 'djs/mobileGetDjs', function(data) {
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
                    if(item.Dj.id == dj_id){
                        goto_index = index;
                    }
                    
                    var id = item.Dj.id;
                    var title = IDIOMA == "castellano" ? item.Dj.title_esp : item.Dj.title_eng;
                    var imagen_redonda = item.Dj.imagen_redonda!=""?item.Dj.imagen_redonda:"default.png";
                    var imagen_fondo = item.Dj.imagen_fondo!=""?item.Dj.imagen_fondo:"default.png";
                    var descripcion = IDIOMA == "castellano" ? item.Dj.descripcion_esp : item.Dj.descripcion_eng;
                    
                    var html='<div class="container custom2" style="background: url('+BASE_URL_APP+'img/djs/'+imagen_fondo+');background-size: 100% auto;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
                        '<div class="content_top">' + 
                            '<div class="imagen left">' +
                                '<img src="'+BASE_URL_APP+'img/djs/' + imagen_redonda + '" />' +
                            '</div>' +
                            '<div class="title left">'+
                                '<a class="sub toogle up" href="javascript:void(0)">' +
                                    '<h2>'+title+'</h2>' +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                        '<div class="content_middle">' +
                            '<p class="descripcion">' + descripcion +'</p>' +
                        '</div>' +
                        '<div class="content_bottom">' +
                            '<div data-role="navbar" data-corners="false">'+
                                '<ul class="nav_options">' +
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
    
	$.getJSON(BASE_URL_APP + 'promos/mobileGetPromociones/'+LATITUDE+"/"+LONGITUDE, function(data) {
        
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
    
	$.getJSON(BASE_URL_APP + 'promos/mobileGetPromociones/'+LATITUDE+"/"+LONGITUDE, function(data) {
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
                    
                    var html='<div class="container custom2" style="background: url('+BASE_URL_APP+'img/promos/'+imagen_fondo+');background-size: 100% auto;min-height:'+(parseInt(parent.attr("lang")) + 2 )+"px"+'">' +
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
    		var item = data.item;
            if(item != ""){
                    
                    var ticket_id = item.Ticket.id;
                    var title = IDIOMA == "castellano" ? item.Sesion.title_esp : item.Sesion.title_eng;
                    var title_dj = IDIOMA == "castellano" ? item.Dj.title_esp : item.Dj.title_eng;
                    var imagen_redonda = item.Sesion.imagen_redonda!=""?item.Sesion.imagen_redonda:"default.png";
                    var precio = item.Ticket.precio != "" ? item.Ticket.precio : 0;
                    var fecha_ini = item.Ticket.fecha_ini;
                    
                    container.find("h3").html(title);
                    container.find("img").attr("src",BASE_URL_APP+'img/sesions/'+imagen_redonda);
                    container.find(".fecha").html(fecha_ini);
                    container.find(".djs").html(title_dj);
                    container.find(".precio").html(precio+"&euro;");
                    
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
                    
                    //proceso de pago
                    container.find("#realizar_compra").unbind("touchstart").bind("touchstart", function(){
                        showAlert("Compra en proceso, espere por favor...","Aviso","Aceptar");
                    });
                    
                    hideLoading();
                    parent.find(".ui-content").fadeIn("slow");
            }else{
                hideLoading();
                parent.find(".ui-content").fadeIn("slow");
            }
        }
	});
}