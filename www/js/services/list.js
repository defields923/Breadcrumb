const _ = window._;
angular.module('breadcrumb').factory('ListFact', function ($rootScope, $http, store) {
  const closeStyle = {
    height: '95px',
    'transition-duration': '250ms',
    overflow: 'hidden',
  };

  const arrayMaker = (num) => {
    const arr = [];
    let i;
    for (i = 0; i < num; i += 1) {
      arr.push(i);
    }
    return arr;
  };

  const getTrails = (request) => {
    let link = 'http://192.168.99.100:3000/trails?';
    // let link = 'http://54.203.104.113/trails';
    if (request === 'id') {
      link += `/id=${$rootScope.trailID}`;
    } else if (request) {
      _.each(request, (val, req) => {
        if (req !== 'username' && val !== null && val !== 'Any') {
          link += `${req}=${val}&`;
        }
      });
    }
    return $http({
      method: 'GET',
      url: `${link}&access_token=${store.get('access_token')}`,
    })
    .then((response) => {
      const data = [];
      response.data.data.forEach((trail) => {
        trail.style = closeStyle;
        // TODO: Integrate actual algorithm to calculate rating from trail.score
        const stars = trail.rating || Math.floor(Math.random() * 6);
        const emptyStars = 5 - stars;
        const difficulty = trail.difficulty;
        trail.stars = arrayMaker(stars);
        trail.emptyStars = arrayMaker(emptyStars);
        trail.difficulty = arrayMaker(difficulty);
        data.push(trail);
      });
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
  };

  const deleteTrail = (trail) => {
    $http({
      method: 'DELETE',
      // url: `http://54.203.104.113/trails/${trail.id}?&access_token=${store.get('access_token')}`,
      url: `http://192.168.99.100:3000/trails/${trail.id}?access_token=${store.get('access_token')}`,
    })
    .then(res => console.warn(res))
    .catch(res => console.error(res));
  };

  const filterListItems = (list, type, value) => {
    const items = list.slice();
    if (value) {
      return items.filter(item => item[type] === value);
    } else if (type === 'stars') {
      return items.sort((a, b) => {
        if (a[type] > b[type]) return -1;
        if (a[type] < b[type]) return 1;
        return 0;
      });
    }
    return items.sort((a, b) => {
      if (a[type] < b[type]) return -1;
      if (a[type] > b[type]) return 1;
      return 0;
    });
  };

  return {
    get: getTrails,
    del: deleteTrail,
    close: closeStyle,
    range: arrayMaker,
    filter: filterListItems,
  };
});
