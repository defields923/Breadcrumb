angular.module('breadcrumb')
.factory('TrailMapFact', function (store) {
  return () => {
    launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, (isAvailable) => {
      let app = '';
      // const dest = store.get('geofences')[0];
      if (isAvailable) {
        app = launchnavigator.APP.GOOGLE_MAPS;
      } else {
        console.warn('Google Maps not available - falling back to user selection');
        app = launchnavigator.APP.USER_SELECT;
      }
      launchnavigator.navigate([store.get('geofences')[0].latitude, store.get('geofences')[0].longitude], {
        app,
      });
    });
  };
});
