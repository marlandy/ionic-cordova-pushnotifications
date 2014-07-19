# IONIC, APACHE CORDOVA AND PUSH NOTIFICATIONS WITH GOOGLE CLOUD MESSAGING SAMPLE #

## Steps: ##

* Start your [GCM REST Service](https://github.com/marlandy/gcm-rest)
* Edit /www/js/configuration.js file
* cordova platform add android
```bash
cordova plugin add https://github.com/phonegap-build/PushPlugin.git
```
* cordova plugin add org.apache.cordova.network-information
* cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git
* cordova run android