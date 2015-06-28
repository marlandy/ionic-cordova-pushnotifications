# IONIC, APACHE CORDOVA AND PUSH NOTIFICATIONS WITH GOOGLE CLOUD MESSAGING SAMPLE #

## Steps: ##

* Start your [GCM REST Service](https://github.com/marlandy/gcm-rest)
* Edit /www/js/configuration.js file
```
cordova platform add android
```
```
cordova plugin add https://github.com/phonegap-build/PushPlugin.git
```
```
cordova plugin add org.apache.cordova.network-information
```
```
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git
```
```
cordova run android
```

## Tutorial (Spanish) ##
[Phonegap/Cordova y las Notificaciones Push](http://www.adictosaltrabajo.com/tutoriales/tutoriales.php?pagina=PhonegapNotificacionesPush)

![](http://www.adictosaltrabajo.com/wp-content/uploads/tutorial-data/PhonegapNotificacionesPush/appforegroundnotification.png)
