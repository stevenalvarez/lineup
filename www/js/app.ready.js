/************************************ GLOBAL VARIABLES *******************************************************/
var APP_INITIALIZED = false;
var LATITUDE = 0;
var LONGITUDE = 0;
var REGISTER_PUSH_NOTIFICATION_TOKEN = false;
var PUSH_NOTIFICATION_REGISTER = '';
var PUSH_NOTIFICATION_TOKEN = -1;
var IDIOMA = 'castellano';
var CIUDAD_ID = 1; //ibiza;
var USUARIO = "";

/* notificacion */
var HAVE_NOTIFICATION = false;
var TYPE_NOTIFICATION = '';
var EVENT = '';

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
        //Inicializamos el pushNotification
        var pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android') {
            //alert("Register called android");
            pushNotification.register(this.successHandler, this.errorHandler,{"senderID":"629734064389","ecb":"app.onNotificationGCM"});
        }
        else {
            //alert("Register called ios");
            pushNotification.register(this.tokenHandler,this.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"app.onNotificationAPN"});
        }        
    },
    // result contains any message sent from the plugin call
    successHandler: function(result) {
        //console.log("Regid " + result);
        //alert('Callback Success! Result = '+result);
    },
    errorHandler:function(error) {
        alert(error);
    },
    tokenHandler:function(result) {
        PUSH_NOTIFICATION_REGISTER = 'ios';
        
        //solo si no se lleno antes con el token llenamos, porque viene otro tipo de mensajes igual
        if(PUSH_NOTIFICATION_TOKEN == -1){
            PUSH_NOTIFICATION_TOKEN = result;
            //mandamos a guardar el token para las notificaciones solo si no se guardo antes
            if(!REGISTER_PUSH_NOTIFICATION_TOKEN){
                registerNewDevice();
            }
        }
        //console.log("Regid " + result);
        //alert('Callback Success! Result = '+result);
    },    
    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    PUSH_NOTIFICATION_REGISTER = 'android';
                    PUSH_NOTIFICATION_TOKEN = e.regid;
                    //console.log("Regid " + e.regid);
                    //alert('registration id = '+e.regid);
                    
                    //mandamos a guardar el token para las notificaciones solo si no se guardo antes
                    if(!REGISTER_PUSH_NOTIFICATION_TOKEN){
                        registerNewDevice();
                    }
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              //alert('message = '+e.message+' msgcnt = '+e.msgcnt);
                if(REGISTER_PUSH_NOTIFICATION_TOKEN){
                    showNotification(e,'android');
                }else{
                    HAVE_NOTIFICATION = true;
                    TYPE_NOTIFICATION = 'android';
                    EVENT = e;
                }
            break;
 
            case 'error':
                alert('GCM error = '+e.msg);
            break;
 
            default:
                alert('An unknown GCM event has occurred');
            break;
        }
    },
    onNotificationAPN: function(event) {
        var pushNotification = window.plugins.pushNotification;
        
        if (event.alert) {
            if(REGISTER_PUSH_NOTIFICATION_TOKEN){
                showNotification(event,'ios');
            }else{
                HAVE_NOTIFICATION = true;
                TYPE_NOTIFICATION = 'ios';
                EVENT = event;
            }
        }
        if (event.badge) {
            pushNotification.setApplicationIconBadgeNumber(this.successHandler, this.errorHandler, event.badge);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
    }
};