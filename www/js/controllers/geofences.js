angular.module('breadcrumb').controller('GeofencesCtrl', function (
  $scope,
  $ionicActionSheet,
  $timeout,
  $log,
  $state,
  Geolocation,
  Geofence,
  $ionicLoading
) {
  $ionicLoading.show({ template: 'Getting geofences from device...', duration: 5000 });

  $scope.geofences = [];

  Geofence.getAll().then((geofences) => {
    $ionicLoading.hide();
    $scope.geofences = geofences;
  }, (reason) => {
    $ionicLoading.hide();
    $log.error('An Error has occured', reason);
  });

  $scope.createNew = () => {
    $log.log('Obtaining current location...');
    $ionicLoading.show({ template: 'Obtaining current location...', hideOnStateChange: true });

    Geolocation.getCurrentPosition().then((position) => {
      $log.log('sup');
      $log.info('Current position found', position);

      $state.go('app.geofence-new', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    }, (reason) => {
      $log.error('Cannot obtain current location', reason);
      $ionicLoading.show({ template: 'Cannot obtain current location', duration: 1500 });
    });
  };

  $scope.editGeofence = (geofence) => {
    $state.go('app.geofence-edit', { geofenceId: geofence.id });
  };

  $scope.removeGeofence = (geofence) => {
    Geofence.remove(geofence);
  };

  $scope.more = () => {
      // Show the action sheet
    $ionicActionSheet.show({
      titleText: 'More options',
      buttons: [
        {
          text: "<i class='icon ion-checkmark-circled'></i> Test application",
        },
      ],
      destructiveText: "<i class='icon ion-trash-b'></i> Delete all geofences",
      cancelText: "<i class='icon ion-android-cancel'></i> Cancel",
      destructiveButtonClicked: () => {
        Geofence.removeAll();
        return true;
      },
      buttonClicked: () => {
        window.location.href = 'cdvtests/index.html';
      },
    });
  };
});
