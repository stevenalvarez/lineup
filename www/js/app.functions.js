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
                REGISTER_PUSH_NOTIFICATION_TOKEN = true;
                
                //recuperamos los datos de ciudad y idioma y si tiene los 2 le llevamos directo ahi
                var usuario_ciudad = data.usuario.Usuario.ciudad_id;
                var usuario_idioma = data.usuario.Usuario.idioma;
                if(usuario_ciudad && usuario_idioma){
                    IDIOMA = usuario_idioma;
                    CIUDAD_ID = usuario_ciudad;
                    $.mobile.changePage("menu.html");
                }
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
    if(seccion == "clubs"){
        page = "clubs.html"
        if(id != ""){
            page = "club_descripcion.html?id="+id;
        }        
    }else if(seccion == "sesiones"){
        page = "sesiones.html";
        if(id != ""){
            page = "sesion_descripcion.html?id="+id;
        }
    }else if(seccion == "pubs"){
        page = "pubs.html";
        if(id != ""){
            page = "pub_descripcion.html?id="+id;
        }
    }else if(seccion == "beachclubs"){
        page = "beachclubs.html";
        if(id != ""){
            page = "beachclubs_descripcion.html?id="+id;
        }
    }else if(seccion == "festivales"){
        page = "festivales.html";
        if(id != ""){
            page = "festivales_descripcion.html?id="+id;
        }
    }else if(seccion == "djs"){
        page = "djs.html";
        if(id != ""){
            page = "dj_descripcion.html?id="+id;
        }
    }else if(seccion == "tickets"){
        page = "calendario.html";
        if(id != ""){
            page = "ticket_descripcion.html?ticket_id="+id;
        }
    }else if(seccion == "promos"){
        page = "promociones.html";
        if(id != ""){
            page = "promocion_descripcion.html?id="+id;
        }
    }
    
    if(seccion != "" && page != ""){
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
    
    setTimeout(function(){
        var height = parent.find(".container").height();
        container.find(".content_top").css("padding-top",(height-90)+'px').attr("lang",height-90);
        
        container.find(".toogle").unbind("touchstart").bind("touchstart", function(){
            var element = $(this);
            if(element.hasClass("up")){
                element.parent().parent().animate({"padding-top": "30px",}, 500, "linear", function() {
                    element.removeClass("up").addClass("down");
                    element.parent().parent().parent().find(".content_middle").fadeIn();
                    setTimeout(function(){
                        element.parent().parent().parent().find(".content_bottom").show();
                    },800);
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
    },500);
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
                                '<span class="subtitle">'+djs_titles+'&nbsp;</span>' +
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
    $.mobile.changePage("ticket_descripcion.html?ticket_id="+ticket_id);
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
            }else{
                usuario_id = COOKIE.id;
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
                    
                    //cargamos los datos unicamente si aun no fueron ya cargados
                    if(container_ul.find("div.item."+slug).html() == undefined)
                    {
                        showLoading();
                        var container_alerta = parent.find(".content_options");
                        $.getJSON(BASE_URL_APP + 'alertas/mobileGetAlertas/'+CIUDAD_ID+"/"+usuario_id+"/"+slug, function(data) {
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
                                    container_alerta.append(c);
                        		});
                                
                                container_alerta.promise().done(function() {
                                    container_alerta.trigger("create");
                                    
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
                                    
                                    scrollToList(container_alerta,parent);	
                                                                    
                                    container_alerta.find("div.item").hide();
                                    container_alerta.find("div.item."+slug).show();
                                    
                                    //recibir/dejar de recibir alertas
                                    container_alerta.find("select").change(function(){
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
                                    
                                    container_ul.animate({opacity: 1}, 200 );
                                    hideLoading();
                                });
                            }else
                            {
                                var html = '<div class="'+slug+' item"><p class="empty">A&Uacute;N NO TENEMOS NING&Uacute;N ITEM</p></div>';
                                container_ul.append(html);
                                container_ul.animate({opacity: 1}, 200 );
                                hideLoading();                                
                            }
                        });                        
                    }else
                    {
                        container_ul.find("div.item."+slug).show();
                        container_ul.animate({opacity: 1}, 200 );
                    }
                });
                
                hideLoading();
                
                //numero de alertas
                var numero_alertas = 5; //container.find(".nav-custom.alertas").find("li").length;
                
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

function procesoPagoPayPal(win, loc){
    alert(loc);
}