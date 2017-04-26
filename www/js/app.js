angular.module('breadcrumb', [
  'ionic',
  'ionic.contrib.ui.tinderCards',
  'leaflet-directive',
  'auth0',
  'angular-storage',
  'angular-jwt',
  'gm',
  'angularReverseGeocode',
])
.run(function (
  $window,
  $document,
  $ionicLoading,
  $state,
  $ionicPlatform,
  $log,
  $rootScope,
  GeofencePluginMock,
  auth,
  store
) {
  $ionicPlatform.ready(function () {
    $rootScope.IP = 'http://54.244.155.187:3000';
    $rootScope.pinged = false;
    $rootScope.toggleSide = true;
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
            $rootScope.pinged = true;
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
          // TODO stop app from reopenin
        });
      }
    };

    $window.geofence.initialize(() => {
      $log.log('Geofence plugin initialized');
    });

    $rootScope.$on('$locationChangeStart', () => {
      if (!auth.isAuthenticated) {
        const token = store.get('token');
        if (token) {
          auth.authenticate(store.get('profile'), token, null, null, store.get('refreshToken'));
        }
      }
    });
    if (store.get('token') && store.get('user')) {
      $rootScope.trailID = store.get('user').current_trail;
      auth.authenticate(store.get('profile'), store.get('token'), null, null, store.get('refreshToken'));
      $state.go('app.dashboard');
    }
  });
})
.value('images', {
  load: (() => Math.floor(Math.random() * 2))(),
  child1: (() => Math.floor(Math.random() * 8))(),
  child2: (() => Math.floor(Math.random() * 8))(),
})
.controller('AppCtrl', function (
  $scope,
  $rootScope,
  auth,
  store,
  $state,
  Data,
  Style,
  $http,
  images
) {
  $scope.logout = () => {
    const user = store.get('user').username;
    const accessToken = store.get('access_token');
    $http({
      url: `${$rootScope.IP}/v1/access_tokens/${user.id}?access_token=${accessToken}`,
      method: 'DELETE',
    }).then(() => {
      auth.signout();
      store.remove('token');
      store.remove('access_token');
      store.remove('profile');
      store.remove('refreshToken');
      store.remove('pic');
      store.remove('user');
      store.remove('geofences');
      $state.go('start', {}, { reload: true });
    }).catch((err) => { console.error(err); });
  };

  $scope.load = Data.load(images.load);

  // $scope.$on('$ionicView.beforeEnter', () => {
  //   $scope.user = store.get('user').username;
  // });

  $scope.test = (input) => {
    console.warn(input);
  };

  $rootScope.filter = {};

  $scope.setFilter = (request) => {
    $rootScope.filter = request;
  };

  $scope.links = Data.menu;

  $scope.theme = Style.theme();

  $scope.child1 = Data.child(images.child1);
  $scope.child2 = Data.child(images.child2);

  $scope.overflowStyle = Style.overflowStyle;

  $rootScope.refresh = false;
});
