angular.module('breadcrumb').factory('Trail', function ($http) {
  const submitTrail = (trail, crumbs) => {
    console.log(trail.user_id);
    const length = trail.length.replace(/[^0-9.]/g, '');
    trail.length = length;
    if (!trail.transport) {
      trail.transport = 'WALKING';
      if (length > 5) {
        trail.transport = 'BICYCLING';
      }
      if (length > 20) {
        trail.transport = 'DRIVING';
      }
    }
    if (!trail.difficulty) {
      trail.difficulty = 1;
      if (length > 5) {
        trail.difficulty = 2;
      } else if (length > 20) {
        trail.difficulty = 3;
      }
    }
    return $http({
      method: 'POST',
      // url: 'http://54.203.104.113/trails',
      url: 'http://192.168.99.100/trails',
      data: trail,
      json: true,
    })
    .then((response) => {
      const trailId = response.data.data[0].id;
      crumbs.forEach((crumb, index) => {
        crumb.trail_id = trailId;
        crumb.order_number = index + 1;
        return $http({
          method: 'POST',
          // url: 'http://54.203.104.113/crumbs',
          url: 'http://192.168.99.100/crumbs',
          data: crumb,
          json: true,
        });
      });
    })
    .catch(err => err);
  };
  return {
    submit: submitTrail,
  };
});
