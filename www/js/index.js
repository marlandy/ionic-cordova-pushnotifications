var app = angular.module('PushNotificationsApp', ['ionic', 'configuration']);
app.factory('NotificationService', function($http, $ionicPopup, StatusHandler, API_BASE_END_POINT) {

    var deviceRegistrationId;
    function registerOn3rdPartyServer(registrationId) {
        deviceRegistrationId = registrationId;
        try {
            $http({
                method: 'POST',
                url: API_BASE_END_POINT + '/api/registrations', /* See /www/js/configuration.js */
                data: 'registrationId=' + registrationId,
                timeout: 5000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            }).success(function() {
                StatusHandler.readyForNotifications();
            }).error(function(e) {
                StatusHandler.notReadyForNotifications();
            });
        } catch (e) {
            alert('http error ' + e);
        }
    }

    function showNotificationPopup(e) {
        var appStatus = 'Background';
        if (e.foreground) {
            appStatus = 'Foreground';
        } else if (e.coldstart) {
            appStatus = 'Coldstart';
        }
        $ionicPopup.alert({
            title: e.payload.title,
            subTitle: appStatus,
            template: e.payload.message
        });
    }

    function sendNotification() {
        $http({
            method: 'POST',
            url: API_BASE_END_POINT + '/api/notifications', /* See /www/js/configuration.js */
            data: {
                "badge": 1,
                "title": "Congratulations!!!",
                "message": "Your notification was successfully sent by Google Cloud Messaging and your 3rd party server!!!",
                "registrationIdsToSend": [deviceRegistrationId]
            },
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function() {
            //TODO!!!
        }).error(function(e) {
            alert("Error sending notification " + e);
        });
    }

    return {
        handleNotification: function(e) {

            switch (e.event) {
                case 'registered':
                    if (e.regid.length > 0) {
                        registerOn3rdPartyServer(e.regid);
                    }
                    break;

                case 'message':
                    showNotificationPopup(e);
                    break;

                case 'error':
                    alert('GCM error = ' + e.msg);
                    break;

                default:
                    alert('An unknown GCM event has occurred');
                    break;
            }

        },
        sendNotification: sendNotification
    };

});

app.factory('GCMRegistrationService', function(SENDER_ID) {
    var pushNotification = window.plugins.pushNotification;
    var isAndroidDevice = function() {
        var platform = device.platform;
        return platform === 'android' || platform === 'Android';
    };

    return {
        registerOnGCM: function() {
            if (isAndroidDevice()) {
                pushNotification.register(function(result) {
                    console.log(result);
                }, function() {
                    alert('Error registering device on GCM ');
                }, {
                    "senderID": SENDER_ID, /* Your Google Developers Console Project Number. See /www/js/configuration.js  */
                    "ecb": "onNotificationGCMEvent" /* index.html function name*/
                });
            } else {
                alert('Your device platform is not Android!!!');
            }

        }
    };
});

app.factory('StatusHandler', function($rootScope, $ionicPopup) {
    var ICON_LOADING = 'ion-loading-b';
    var ICON_OK = 'ion-checkmark-circled balanced';
    var ICON_ERROR = 'ion-close-circled assertive';
    var loading = function() {
        $rootScope.status = {
            'style': 'stable',
            'text': 'LOADING...',
            'networkicon': ICON_LOADING,
            'thirddpartyservericon': ICON_LOADING,
            'button': {
                'disabled': 'disabled',
                'style': 'button-light'
            }
        };
    };

    var online = function() {
        $rootScope.status = {
            'style': 'calm',
            'text': 'ONLINE',
            'networkicon': ICON_OK,
            'thirddpartyservericon': ICON_LOADING,
            'disabled': 'false',
            'button': {
                'disabled': 'disabled',
                'style': 'button-light'
            }
        };
    };

    var offline = function() {
        $rootScope.$apply(function() {
            $rootScope.status = {
                'style': 'assertive',
                'text': 'OFFLINE',
                'networkicon': ICON_ERROR,
                'thirddpartyservericon': ICON_ERROR,
                'disabled': 'false',
                'button': {
                    'disabled': 'disabled',
                    'style': 'button-light'
                }
            };
        });
    };

    var readyForNotifications = function() {
        $rootScope.status = {
            'style': 'balanced',
            'text': 'READY FOR NOTIFICATIONS',
            'networkicon': ICON_OK,
            'thirddpartyservericon': ICON_OK,
            'disabled': 'false',
            'button': {
                'disabled': 'button-positive'
            }
        };
    };

    var notReadyForNotifications = function() {
        $rootScope.status = {
            'style': 'assertive',
            'text': '3rd PARTY SERVER ERROR',
            'networkicon': ICON_OK,
            'thirddpartyservericon': ICON_ERROR,
            'disabled': 'false',
            'button': {
                'disabled': 'disabled',
                'style': 'button-light'
            }
        };
        $ionicPopup.alert({
            title: 'ERROR!!!',
            subTitle: 'Unable to connect to 3rd party server',
            template: 'Unable to connecto to 3rd party server.<br/>Please, review your server connection.<br/>See /www/js/configuration.js file'
        });
    };

    return {
        loading: loading,
        online: online,
        offline: offline,
        readyForNotifications: readyForNotifications,
        notReadyForNotifications: notReadyForNotifications
    };

});

app.controller('AppController', function($scope, NotificationService) {

    $scope.sendNotification = function() {
        NotificationService.sendNotification();
    };

});

app.run(function(GCMRegistrationService, StatusHandler) {
    var alreadyRegistered = false;

    StatusHandler.loading();

    document.addEventListener("online", function() {
        StatusHandler.online();
        registerOnGCM();
    }, false);

    document.addEventListener("offline", function() {
        alreadyRegistered = false;
        StatusHandler.offline();
    }, false);

    function isOnline() {
        return navigator.network.connection.type !== Connection.NONE;
    }

    function registerOnGCM() {
        if (!alreadyRegistered) {
            alreadyRegistered = true;
            GCMRegistrationService.registerOnGCM();
        }
    }

    if (isOnline()) {
        StatusHandler.online();
        registerOnGCM();
    } else {
        StatusHandler.offline();
    }

});
