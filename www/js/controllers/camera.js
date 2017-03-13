angular.module('ionic-geofence').controller('CameraCtrl', function (
  $scope
) {
  $scope.takePicture = () => {
    function onSuccess(imageData) {
      const image = document.getElementById('myImage');
      image.src = `data:image/jpeg;base64,${imageData}`;
    }

    function onFail(message) {
      console.warn(`Failed because: ${message}`);
    }
    navigator.camera.getPicture(onSuccess, onFail, {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
    });
  };
});
