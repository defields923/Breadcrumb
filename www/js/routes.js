angular.module('breadcrumb')
  .config(function ($stateProvider,
    $urlRouterProvider,
    authProvider,
    $httpProvider,
    jwtInterceptorProvider,
    jwtOptionsProvider
  ) {
    $stateProvider
      .state('start', {
        url: '/start',
        templateUrl: 'views/start.html',
        controller: 'AppCtrl',
      })
      .state('auth0', {
        url: '/auth0',
        templateUrl: 'views/auth0.html',
        controller: 'LoginCtrl',
      })
      .state('signUp', {
        url: '/sign-up',
        templateUrl: 'views/signup.html',
        controller: 'AuthCtrl',
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'views/settingsNoUser.html',
        controller: 'AuthCtrl',
        cache: false,
      })
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'views/menu.html',
        controller: 'AppCtrl',
        data: {
          requiresLogin: true,
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
      .state('app.trail', {
        url: '/trail',
        views: {
          menuContent: {
            templateUrl: 'views/trail.html',
            controller: 'TrailCtrl',
          },
        },
        cache: false,
      })
      .state('app.create', {
        url: '/create',
        views: {
          menuContent: {
            templateUrl: 'views/create.html',
            controller: 'CreateTrailCtrl',
          },
        },
        cache: false,
      })
      .state('app.search', {
        url: '/search',
        views: {
          menuContent: {
            templateUrl: 'views/search.html',
            controller: 'ListCtrl',
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
      .state('app.settings', {
        url: '/updatesettings',
        views: {
          menuContent: {
            templateUrl: 'views/settings.html',
            controller: 'AuthCtrl',
          },
        },
        cache: false,
      });

    authProvider.init({
      domain: 'defields923.auth0.com',
      clientID: 'WjzyvWzAQ8jN72gc0NR6pWBEG8gWM2Wn',
      loginState: 'start',
    });

    $urlRouterProvider.otherwise('/start');

    jwtOptionsProvider.config({
      whiteListedDomains: [
        'http://54.203.104.113/',
        'http://172.24.2.65:8100',
        'http://192.168.99.100/',
        'http://172.24.2.139:8100',
        'http://54.202.110.207:3000'
      ],
    });

    jwtInterceptorProvider.tokenGetter = (store, jwtHelper, auth) => {
      const idToken = store.get('token');
      const refreshToken = store.get('refreshToken');
      if (!idToken || !refreshToken) {
        return null;
      }
      if (jwtHelper.isTokenExpired(idToken)) {
        return auth.refreshIdToken(refreshToken).then((idTokenResult) => {
          store.set('token', idTokenResult);
          return idTokenResult;
        });
      }
      return idToken;
    };

    $httpProvider.interceptors.push('jwtInterceptor');
  });
