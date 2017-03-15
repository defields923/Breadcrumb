/* eslint no-bitwise: ["error", { "allow": ["^=", "&"] }] */

angular.module('breadcrumb')
.controller('ProfileCtrl', function ($scope) {
  $scope.user = {
    name: 'NAME',
    score: 500,
    finishedTrails: 3,
    totalTime: 0,
    trail: {
      name: `My ${Math.floor(Math.random() * 100)}th trail`,
      stars: [1, 2, 3, 4],
      nostars: [1],
      progress: `${Math.floor(Math.random() * 100)}%`,
    },
  };

  const trailmaker = () => {
    const tran = Math.floor(Math.random() * 4) + 1;
    const stars = Math.floor(Math.random() * 5);
    const noStars = 5 - stars;
    const difficulty = Math.floor(Math.random() * 5) + 1;
    return {
      name: `Trail ${Math.floor(Math.random() * 100)}`,
      transport: tran,
      stars: [1, 2, 3, 4],
      nostars: [1],
      difficulty: [1, 2, 3],
      length: (Math.floor(Math.random() * 5) + 2) * tran,
      progress: `${Math.floor(Math.random() * 100)}%`,
    };
  };

  $scope.stars = () => [1, 2, 3, 4];

  $scope.nostars = () => [1];

  $scope.difficulty = () => [1, 2, 3];

  $scope.exampleTrail = {
    name: 'My first trail',
    rating: 5,
    difficulty: 3,
    length: 25,
    progress: '50%',
  };

  $scope.userTrails = [
    trailmaker(),
    trailmaker(),
    trailmaker(),
  ];

  $scope.pastTrails = [
    trailmaker(),
    trailmaker(),
    trailmaker(),
  ];
});
