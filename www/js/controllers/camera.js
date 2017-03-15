angular.module('ionic-geofence').controller('CameraCtrl', function (
  $scope,
  $http,
  $cordovaCamera,
  $cordovaFile,
  $cordovaFileTransfer,
  $log
) {
  this.pictureAnalysis = null;

  $scope.takePicture = () => {
    const options = {
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      targetWidth: 500,
      targetHeight: 500,
      correctOrientation: true,
      cameraDirection: 0,
      encodingType: Camera.EncodingType.JPEG,
    };

    $cordovaCamera.getPicture(options).then((imagedata) => {
      // const current_image = `data:image/jpeg;base64,${imagedata}`;
      // const image_description = '';
      // const locale = '';

      const visionApiJson = {
        requests: [
          {
            image: {
              content: imagedata,
            },
            features: [
              {
                type: 'LOGO_DETECTION',
                maxResults: 5,
              },
            ],
          },
        ],
      };
      const fileContents = JSON.stringify(visionApiJson);
      const req = {
        method: 'POST',
        // TODO: get this shit deployed and off my local computer
        url: 'http://172.24.2.41:5000/picture/labels',
        headers: {
          'Content-Type': 'application/json',
        },
        data: fileContents,
      };

      $http(req).then((res) => {
        $log.log(res.responses);
        this.pictureAnalysis = res.responses;
        $log.log(this.pictureAnalysis);
      }, (err) => { console.warn(err); });
    }, (err) => { console.warn('An error occurred getting the picture from the camera', err); });
  };
});
