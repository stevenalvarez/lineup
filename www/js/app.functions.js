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

//registramos el dispositivo solo si no fue registrado
function registerNewDevice(){
    
    $.ajax({
        data: {device_plataforma:device.platform, device_version:device.version, device_uuid:device.uuid, token_notificacion:PUSH_NOTIFICATION_TOKEN},
        type: "POST",
        url: BASE_URL_APP + 'usuarios/mobileNewRegistro',
        dataType: "html",
        success: function(data){
            data = $.parseJSON(data);
            var success = data.success;
            if(success){
                //una vez creado guardamos en cookies su datos importantes
                createCookie("user", JSON.stringify(data.usuario.Usuario), 365);
                REGISTER_PUSH_NOTIFICATION_TOKEN = true;
            }else if(data.usuario != ""){
                //si ya se registro con anterioridad guardamos los datos en la cookie
                createCookie("user", JSON.stringify(data.usuario.Usuario), 365);
            }
        }
    });
}

//MOSTRAMOS EL GOOGLE MAP DEL LOCAL
function showGoogleMap(parent_id, latitud, longitud) {
    var parent = $("#"+parent_id);
    //titulo para la pagina
    var titulo = IDIOMA == "castellano" ? "Mapa" : "Map";
    parent.find(".ui-header").find(".page h2").html(titulo);
    
    //Mapa
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
        // Enable the visual refresh
        google.maps.visualRefresh = true;
        setTimeout(function(){
            google.maps.event.trigger(map, 'resize');
        },200);
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

/*animacion para el la descripcion de cualquier item*/
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
    
    //scroll
    setTimeout(function(){
        container.find(".owl-item").each(function(i,item){
            $(this).find(".container").height($(this).height());
            //$(this).find(".container").niceScroll({touchbehavior:true});
            $(this).find(".container").css("overflow","visible");
            $(this).find(".container").css("overflow-x","hidden");
        });
    },300);
}

function scrollToList(container,parent){
    INTERVAL = setInterval(function(){
        if(parent.attr("lang") != undefined){
            parent.find(".ui-content").height(parent.attr("lang")+"px");
            //parent.find(".ui-content").niceScroll({touchbehavior:true});
            clearInterval(INTERVAL);
        }
    },100);
}

/*ajax para sacar las sesiones y mostralos*/
function ajaxCalendario(value, club_id, sesion_id){
    var container = $("#tickets.lista");
    container.html("");
    
    //mostramos loading
    showLoading();
    
	$.getJSON(BASE_URL_APP + 'tickets/mobileGetTicketByDate/'+value+"/"+club_id+"/"+sesion_id+"/"+LATITUDE+"/"+LONGITUDE, function(data) {
        
        if(data.items){
            //fondo para la pagina
            if(data.fondo != undefined && data.fondo != ""  && data.fondo.Fondo.imagen != undefined){
                var fondo = data.fondo.Fondo.imagen;
                $("#calendario").css("background","url('"+BASE_URL_APP+"img/fondos/"+fondo+"')");
                $("#calendario").css("background-size","100% 100%");
            }
            
            //titulo para la pagina
            if(data.pagina != undefined && data.pagina != ""){
                var titulo = IDIOMA == "castellano" ? data.pagina.Sistema.title_esp : data.pagina.Sistema.title_eng;
                $("#calendario").find(".ui-header").find(".page h2").html(titulo);
            }
                        
    		var items = data.items;
            if(items.length){
        		$.each(items, function(index, item) {
        		  
                    var ticket_id = item.Ticket.id;
                    var title = IDIOMA == "castellano" ? item.Sesion.title_esp : item.Sesion.title_eng;
                    var djs_titles = "";
                    var djs = item.Dj;
                    $(djs).each(function(i,dj) {
                        djs_titles+= IDIOMA == "castellano" ? dj.title_esp : dj.title_eng;
                        if($(djs).length != (i+1)) djs_titles+= ", ";
                    });
                    var imagen_redonda = item.Sesion.imagen_redonda!=""?item.Sesion.imagen_redonda:"default.png";
                    var precio = item.Ticket.precio != "" ? item.Ticket.precio : 0;
                    var kilomentros = item.Club.kilomentros;
                    var metros = item.Club.metros;
                    
                    var html='<a  lang="'+imagen_redonda+'" class="custom item" href="javascript:void(0)" onclick="gotoTicket(this,'+ticket_id+','+precio+')" data-role="button" data-icon="none">' +
                            '<span class="bg">' +
                                '<span class="title">'+title+'</span>' +
                                '<span class="subtitle">'+djs_titles+'</span>' +
                                '<span class="km inline">';
                                //si esta menos de 1km le mostramos la distancia en metros en la cual se encuentra
                                if(parseInt(kilomentros) < 1){
                                    html+=parseFloat(metros).toFixed(2)+'M';
                                }else{
                                    html+=parseFloat(kilomentros).toFixed(2)+'KM';
                                }                                
                                html+='</span>';
                                
                                if(parseInt(precio) > 1){
                                    html+='<span class="euro inline">'+precio+'&euro;</span>';
                                }
                            html+='</span>' +
                        '</a>';
                    container.append(html);
        		});
                
                container.promise().done(function() {
                    container.trigger("create");
                    
                    container.find("a").each(function( index ) {
                        var cls = "itemticket"+index;
                        $(this).addClass(cls);
                        $('head').append("<style>.ui-btn-icon-left."+cls+":after{ background: url("+BASE_URL_APP+'/img/sesions/'+$(this).attr("lang")+") no-repeat scroll 0 0 transparent; }</style>");
                    });
                    
                    //ocultamos loading
                    hideLoading();
                });
            }else{
                container.append("<p class='empty'>A&Uacute;N NO TENEMOS TICKETS EN ESTA FECHA</p>");
                //ocultamos loading
                hideLoading();
            }
        }
	});
}

function gotoTicket(thiss, ticket_id, precio){
    if(parseInt(precio) > 0){
        $.mobile.changePage("ticket_descripcion.html?ticket_id="+ticket_id);
    }else{
        showAlert("Tickets no disponibles para esta sesi\u00F3n", "Aviso", "Aceptar");
    }
}

function getClubsAll(parent_id,filtro_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".ui-footer");
    container.find('li').remove();
    
    container.hide();
    
	$.getJSON(BASE_URL_APP + 'clubs/mobileGetClubsAll/'+CIUDAD_ID, function(data) {
        
        if(data.items){
            showLoading();
            
    		items = data.items;
            if(items.length){
                var html = '<div data-role="navbar" data-corners="false"><ul class="nav-custom clubs">';
        		$.each(items, function(index, item) {
        		    var title = IDIOMA == "castellano" ? item.Club.title_esp : item.Club.title_eng;
                    var imagen_redonda = item.Club.imagen_redonda!=""?item.Club.imagen_redonda:"default.png";
        		    html+= '<li><a id="club_'+item.Club.id+'" lang="'+imagen_redonda+'" href="#'+item.Club.id+'" data-icon="none" data-iconpos="top">'+title+'</a></li>';
        		});
                html+='</ul></div>';
                container.find(".ui-navbar").remove();
                container.append(html);
                //refresh
        		container.trigger("create");
                
                //colocamos su background
                container.find("a").each(function( index ) {
                    var cls = "itemclubsall"+index;
                    $(this).addClass(cls);
                    $('head').append("<style>.ui-btn-icon-top."+cls+":after{ background: url("+BASE_URL_APP+'/img/clubs/'+$(this).attr("lang")+") no-repeat scroll 0 0 transparent; }</style>");
                });
                
                var page = $("#" + $.mobile.activePage.attr('id'));
                page.find(".clubs").find("a").unbind("touchstart").bind("touchstart", function(){
                    page.find(".clubs").find("a").removeClass("ui-btn-active-a");
                    $(this).addClass("ui-btn-active-a");
                    var club_id = $(this).attr("href");
                    club_id = club_id.substring(1,club_id.length);
                    
                    //mostramos u ocultamos los items segun su zona
                    var container_ul = page.find(".ui-listview");
                    container_ul.css("opacity","0.5");
                    container_ul.find("li").hide();
                    container_ul.find("li.club_"+club_id).show();
                    container_ul.animate({opacity: 1}, 500 );
                });
                
                hideLoading();
                
                //numero de clubs
                var numero_clubs = 4; //container.find(".nav-custom.clubs").find("li").length;
                
                //aplicamos el slider carrousel
                container.promise().done(function() {
                    //iniciamos el carrousel
                    container.find(".nav-custom.clubs").owlCarousel({
                        pagination : false,
                        items : numero_clubs,
                        itemsMobile : [479,numero_clubs],
                        responsive: false,
                    });
                    container.find(".nav-custom.clubs").find("li").css("width","100%");
                    container.find(".nav-custom.clubs").find(".owl-wrapper-outer").css("overflow","inherit");
                });
                
                container.find(".nav-custom.clubs").find("li a#club_"+filtro_id).addClass("ui-btn-active-a");     
                container.fadeIn("slow");
            }
        }
	});
}

function getMenuFooter(parent_id,filtro_id){
    var parent = $("#"+parent_id);
    var container = parent.find(".ui-footer");
    container.find('li').remove();
    
    container.hide();
    
	$.getJSON(BASE_URL_APP + 'sistemas/mobileGetMenuFooter', function(data) {
        
        if(data.items){
            showLoading();
            
            //si no esta logeado no puede hacer nada, por eso colocamos los valores vacio
            var usuario_id = "";
            if(!isLogin()){
                data.items = "";
            }
            
    		items = data.items;
            if(items.length){
                var html = '<div data-role="navbar" data-corners="false"><ul class="nav-custom alertas">';
        		$.each(items, function(index, item) {
        		    var id = item.Sistema.id;
                    var title = IDIOMA == "castellano" ? item.Sistema.title_esp : item.Sistema.title_eng;
                    var imagen = item.Sistema.slug+".png";
                    html+= '<li><a id="'+item.Sistema.slug+'" lang="'+imagen+'" href="#'+item.Sistema.slug+'" data-icon="none" data-iconpos="top">'+title+'</a></li>';
        		});
                html+='</ul></div>';
                container.find(".ui-navbar").remove();
                container.append(html);
                
                //refresh
        		container.trigger("create");
                
                //colocamos su background
                container.find("a").each(function( index ) {
                    var cls = "itemalertasall"+index;
                    $(this).addClass(cls);
                    $('head').append("<style>.ui-btn-icon-top."+cls+":after{ background: url(img/bg_"+$(this).attr("lang")+") no-repeat scroll 0 0 transparent; }</style>");
                });
                
                var page = $("#" + $.mobile.activePage.attr('id'));
                page.find(".alertas").find("a").unbind("touchstart").bind("touchstart", function(){
                    page.find(".alertas").find("a").removeClass("ui-btn-active-a");
                    $(this).addClass("ui-btn-active-a");
                    var slug = $(this).attr("href");
                    slug = slug.substring(1,slug.length);
                    
                    //mostramos u ocultamos los items segun su zona
                    var container_ul = page.find(".content_options");
                    container_ul.css("opacity","0.5");
                    container_ul.find("div.item").hide();
                    container_ul.find("div.item."+slug).show();
                    container_ul.animate({opacity: 1}, 500 );
                });
                
                hideLoading();
                
                //numero de alertas
                var numero_alertas = 4; //container.find(".nav-custom.alertas").find("li").length;
                
                //aplicamos el slider carrousel
                container.promise().done(function() {
                    //iniciamos el carrousel
                    container.find(".nav-custom.alertas").owlCarousel({
                        pagination : false,
                        items : numero_alertas,
                        itemsMobile : [479,numero_alertas],
                        responsive: false,
                    });
                    container.find(".nav-custom.alertas").find("li").css("width","100%");
                    container.find(".nav-custom.alertas").find(".owl-wrapper-outer").css("overflow","inherit");
                });
                
                //Para madrid (id=3)no se muestra beach
                if(CIUDAD_ID == 3) container.find("#beachclubs").parent().parent().hide();
                
                container.find(".nav-custom.alertas").find("li a#"+filtro_id).addClass("ui-btn-active-a");
                container.fadeIn("slow");
            }
        }
	});
}