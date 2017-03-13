angular.module('ionic-geofence').config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'views/menu.html',
      controller: 'AppCtrl',
    })
    .state('app.geofences', {
      url: '/geofences',
      views: {
        menuContent: {
          templateUrl: 'views/geofence/geofences.html',
          controller: 'GeofencesCtrl',
        },
      },
    })
    .state('app.geofence-new', {
      url: '/geofence/new/:longitude,:latitude',
      views: {
        menuContent: {
          templateUrl: 'views/geofence/geofence.html',
          controller: 'GeofenceCtrl',
        },
      },
      resolve: {
        geofence($stateParams, Geofence) {
          return Geofence.create({
            longitude: parseFloat($stateParams.longitude),
            latitude: parseFloat($stateParams.latitude),
          });
        },
      },
    })
    .state('app.geofence-edit', {
      url: '/geofence/:geofenceId',
      views: {
        menuContent: {
          templateUrl: 'views/geofence/geofence.html',
          controller: 'GeofenceCtrl',
        },
      },
      resolve: {
        geofence($stateParams, Geofence, $q) {
          const geofence = Geofence.findById($stateParams.geofenceId);

          if (geofence) {
            return $q.when(angular.copy(geofence));
          }

          return $q.reject(`Cannot find geofence with id: ${$stateParams.geofenceId}`);
        },
      },
    })
    .state('app.camera', {
      url: '/camera',
      views: {
        menuContent: {
          templateUrl: 'views/camera.html',
          controller: 'CameraCtrl',
        },
      },
    });

  $urlRouterProvider.otherwise('/app/geofences');
});
