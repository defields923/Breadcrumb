// Ionic Geofence example App

angular.module('breadcrumb', ['ionic', 'ionic.contrib.ui.tinderCards', 'leaflet-directive'])
.run(function (
  $window,
  $document,
  $ionicLoading,
  $state,
  $ionicPlatform,
  $log,
  $rootScope,
  GeofencePluginMock
) {
  $ionicPlatform.ready(function () {
    $log.log('Ionic ready');
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if ($window.cordova && $window.cordova.plugins.Keyboard) {
      $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if ($window.StatusBar) {
      $window.StatusBar.styleDefault();
    }
    if ($window.geofence === undefined) {
      $log.warn('Geofence Plugin not found. Using mock instead.');
      $window.geofence = GeofencePluginMock;
      $window.TransitionType = GeofencePluginMock.TransitionType;
    }
    if (navigator.splashscreen) {
      navigator.splashscreen.hide();
    }

    $window.geofence.onTransitionReceived = (geofences) => {
      $log.log(geofences);
      if (geofences) {
        $rootScope.$apply(() => {
          geofences.forEach((geo) => {
            geo.notification = geo.notification || {
              title: 'Geofence transition',
              text: 'Without notification',
            };
            $ionicLoading.show({
              template: `${geo.notification.title}: ${geo.notification.text}`,
              noBackdrop: true,
              duration: 2000,
            });
          });
        });
      }
    };

    $window.geofence.onNotificationClicked = (notificationData) => {
      $log.log(notificationData);

      if (notificationData) {
        $rootScope.$apply(() => {
          $ionicLoading.show({
            template: `Notification clicked: ${notificationData.notification.text}`,
            noBackdrop: true,
            duration: 2000,
          });

          $state.go('geofence', {
            geofenceId: notificationData.id,
          });
        });
      }
    };

    $window.geofence.initialize(() => {
      $log.log('Geofence plugin initialized');
    });

    Parse.initialize("YOUR APP ID", "JAVASCRIPT KEY");
  });

  $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
    $log.log('stateChangeError', error, toState, toParams, fromState, fromParams);
    $state.go('geofences');
  });
})
.controller('AppCtrl', function ($scope) {
  // $scope.scope = null;
  $scope.test = (input) => {
    console.warn(input);
  };
});
