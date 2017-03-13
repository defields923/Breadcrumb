angular.module('breadcrumb').config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'views/menu.html',
      controller: 'AppCtrl',
    })
    .state('app.start', {
      url: '/start',
      views: {
        menuContent: {
          templateUrl: 'views/start.html',
          controller: 'GeofencesCtrl',
        },
      },
    })
    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        menuContent: {
          templateUrl: 'views/dashboard.html',
          controller: 'ListCtrl',
        },
      },
    })
    .state('app.create', {
      url: '/create',
      views: {
        menuContent: {
          templateUrl: 'views/create.html',
          controller: 'CreateTrailCtrl',
        },
      },
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        menuContent: {
          templateUrl: 'views/profile.html',
          controller: 'ProfileCtrl',
        },
      },
    })
    .state('app.signUp', {
      url: '/sign-up',
      views: {
        menuContent: {
          templateUrl: 'views/signup.html',
          controller: 'AuthCtrl',
        },
      },
    })
    .state('app.settings', {
      url: '/settings',
      views: {
        menuContent: {
          templateUrl: 'views/settings.html',
          controller: 'AuthCtrl',
        },
      },
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
    });

  $urlRouterProvider.otherwise('/app/dashboard');
});
