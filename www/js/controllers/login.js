angular.module('breadcrumb')
.controller('LoginCtrl', function ($scope, auth, $state, store) {
  $scope.doAuth = () => {
    auth.signin({
      authParams: {
        scope: 'openid offline_access',
        device: 'Mobile device',
      },
      standalone: true,
      autoclose: true,
      container: 'widget'
    }, (profile, idToken, accessToken, state, refreshToken) => {
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      console.log(profile);
      $state.go('app.dashboard');
    }, (error) => {
      console.warn('There was an error logging in', error);
    });
  };

  $scope.$on('$ionic.reconnectScope', () => {
    $scope.doAuth();
  });

  $scope.doAuth();

  $scope.logout = () => {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('app.dashboard', {}, { reload: true });
  };
});
