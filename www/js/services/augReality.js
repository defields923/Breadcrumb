angular.module('breadcrumb').factory('AugRealFact', function ($http, store, $rootScope) {
  let messages = [
    { username: 'broHeim', message: 'sup bro', bearing: 130 },
    { username: 'Munch', message: 'hey man', bearing: 39 },
    { username: 'ali', message: 'yooo', bearing: 273 },
  ];

  const calculateDirection = (degree) => {
    let detected = 0;
    $('#spot').html('');
    messages.forEach((val, i) => {
      const fontSize = 6;
      const fontColor = 'white';
      $('#spot').append(`<div class="comment" data-id=${i} style="display:block;margin-left:${(((val.bearing - degree) * 5) + 50)}px;width:${($(window).width() - 100)}px;font-size:${fontSize}px;color:${fontColor}">${messages[i].username}<div>${messages[i].message}</div></div>`);
      detected = 1;
    });
    if (!detected) {
      $('#spot').html('');
    }
  };

  const onAccelerometerSuccess = () => {};

  const onAccelerometerError = () => console.error('Accelerometer error');

  const onCompassSuccess = (heading) => {
    const degree = heading.magneticHeading;
    calculateDirection(degree);
  };

  const onCompassError = (compassError) => {
    console.error(`Compass failed: ${compassError}`);
  };

  let watchAccelerometerID = null;
  let watchCompassID = null;

  const startAccelerometer = () => {
    const options = { frequency: 100 };
    watchAccelerometerID =
      navigator.accelerometer
        .watchAcceleration(onAccelerometerSuccess, onAccelerometerError, options);
  };
  const stopAccelerometer = () => {
    if (watchAccelerometerID) {
      navigator.accelerometer.clearWatch(watchAccelerometerID);
      watchAccelerometerID = null;
    }
  };
  const startCompass = () => {
    const options = { frequency: 100 };
    watchCompassID =
      navigator.compass.watchHeading(onCompassSuccess, onCompassError, options);
  };
  const stopCompass = () => {
    if (watchCompassID) {
      const watch = navigator.compass.clearWatch(watchCompassID);
      watch.then(() => console.warn('Compass off'));
      watchCompassID = null;
    }
  };


  const videoOverlay = () => {
    const accToken = store.get('access_token');
    const crumbId = store.get('geofences')[0].id;
    $http({
      url: `${$rootScope.IP}/ar_messages`,
      method: 'GET',
      params: {
        access_token: accToken,
        crumb_id: crumbId,
      },
    })
    .then((res) => {
      messages = res.data.data;
      // TODO: where on res is the data?
      if (window.ezar) {
        ezar.initializeVideoOverlay(() => {
          $('#spot').css('display', 'block');
          $('.comment').css('display', 'block');
          ezar.getBackCamera().start();
          startAccelerometer();
          startCompass();
        }, (err) => {
          console.error(`unable to init ezar: ${err}`);
        });
      }
    })
    .catch(() => {
      messages = [
        { username: 'broHeim', message: 'sup bro', bearing: 130 },
        { username: 'friendlyfello', message: 'hey man', bearing: 39 },
        { username: 'ali', message: 'yooo that\'s sick', bearing: 273 },
      ];
    });
  };

  const stopVideoOverlay = () => {
    ezar.getBackCamera().stop();
    $('#spot').css('display', 'none');
    $('.comment').css('display', 'none');
    stopAccelerometer();
    stopCompass();
  };

  return {
    startAR: videoOverlay,
    stopAR: stopVideoOverlay,
    accelSucc: onAccelerometerSuccess,
    accelErr: onAccelerometerError,
    compSucc: onCompassSuccess,
    compErr: onCompassError,
    messages,
  };
});
