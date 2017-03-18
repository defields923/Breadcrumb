/* eslint no-bitwise: ["error", { "allow": ["^=", "&"] }] */
/* global TransitionType */

angular.module('breadcrumb')
.controller('CreateTrailCtrl', function ($scope, $state, Trail, Map, Data) {
  const moveX = (crumb, num) => {
    const move = `${crumb.left += num}%`;
    const style = {
      left: move,
      'transition-duration': '250ms',
    };
    crumb.style = style;
  };

  const moveY = (crumb, num) => {
    const style = {
      'transition-duration': '1000ms',
      transform: `translate(0px, ${num}px)`,
    };
    crumb.style = style;
  };

  const moveReset = (crumb, index) => {
    crumb.left = 100 * index;
    const move = `${crumb.left += 2.5}%`;
    const style = {
      'transition-duration': '1000ms',
      top: '0px',
      left: move,
    };
    crumb.style = style;
  };

  const trailMaker = () => ({
    name: Data.trailName(),
    description: Data.description(),
    type: $scope.trailTypes[0],
    difficulty: null,
    map: null,
    time: null,
    length: null,
    requires_money: false,
    transport: null,
    crumbs: {},
    left: 2.5,
    style: null,
  });

  $scope.loading = { display: 'none' };

  $scope.trailTypes = [
    'adventure',
    'mystery',
    'casual',
    'tour',
    'scavenger',
    'nature',
    'history',
  ].sort();

  $scope.step = 0;

  $scope.changeStep = (change) => {
    if (change) {
      $scope.step += 1;
    } else if (!change) {
      $scope.step -= 1;
    }
    if ($scope.step < 0) {
      $scope.step = $scope.trailTypes.length - 1;
    } else if ($scope.step === $scope.trailTypes.length) {
      $scope.step -= $scope.trailTypes.length;
    }
    $scope.trail.type = $scope.trailTypes[$scope.step];
  };

  $scope.difficulty = {
    0: {
      type: 'easy',
      style: null,
    },
    1: {
      type: 'medium',
      style: null,
    },
    2: {
      type: 'hard',
      style: null,
    },
  };

  $scope.fillDifficulty = (diff) => {
    const fill = {
      color: 'purple',
    };
    $scope.difficulty[0].style = null;
    $scope.difficulty[1].style = null;
    $scope.difficulty[2].style = null;
    if (diff === 'easy') {
      $scope.trail.difficulty = 1;
      $scope.difficulty[0].style = fill;
    }
    if (diff === 'medium') {
      $scope.trail.difficulty = 2;
      $scope.difficulty[0].style = fill;
      $scope.difficulty[1].style = fill;
    }
    if (diff === 'hard') {
      $scope.trail.difficulty = 3;
      $scope.difficulty[0].style = fill;
      $scope.difficulty[1].style = fill;
      $scope.difficulty[2].style = fill;
    }
  };

  $scope.transport = {
    WALKING: {
      type: 'walk',
      style: null,
    },
    BICYCLING: {
      type: 'bicycle',
      style: null,
    },
    TRANSIT: {
      type: 'bus',
      style: null,
    },
    DRIVING: {
      type: 'car',
      style: null,
    },
  };

  $scope.transChange = (type) => {
    $scope.transport.WALKING.style = null;
    $scope.transport.BICYCLING.style = null;
    $scope.transport.TRANSIT.style = null;
    $scope.transport.DRIVING.style = null;
    $scope.transport[type].style = {
      'background-color': '#F8F8F8',
      'border-radius': '50px',
    };
  };

  $scope.money = (boolean) => {
    $scope.trail.requires_money = !boolean;
    if (boolean) $scope.moneyStyle = null;
    else {
      $scope.moneyStyle = {
        'background-color': '#F8F8F8',
        'border-radius': '50px',
        color: '#33CD61',
      };
    }
  };

  $scope.moneyStyle = null;

  $scope.review = {
    check: false,
    style: { display: 'none' },
  };

  $scope.trail = trailMaker();

  $scope.crumb = () => ({
    name: null,
    description: Data.crumbDescription(),
    location: Data.address(),
    text: null,
    media: null,
    image: null,
    video: null,
    ar: null,
    left: 2.5,
    style: { 'animation-name': 'moveInFromRight' },
  });

  $scope.crumbs = [];

  $scope.add = () => {
    if (!$scope.review.check) {
      $scope.move(-100);
      $scope.trail.crumbs = $scope.crumbs.slice();
      const crumb = $scope.crumb();
      $scope.crumbs.push(crumb);
    }
  };

  $scope.remove = (index) => {
    $scope.crumbs.splice(index, 1);
    if (!$scope.review.check) {
      $scope.trail.crumbs = $scope.crumbs.slice();
      moveReset($scope.trail, 0);
      $scope.crumbs.forEach((crumb, ind) => {
        moveReset(crumb, ind + 1);
      });
    }
  };

  $scope.cardSwipedLeft = (index) => {
    if (!$scope.crumbs.length || index === $scope.crumbs.length) {
      return null;
    }
    return $scope.move(-100);
  };

  $scope.cardSwipedRight = () => {
    $scope.move(100);
  };

  $scope.move = (num) => {
    if (!$scope.review.check) {
      moveX($scope.trail, num);
      $scope.crumbs.forEach((crumb) => {
        moveX(crumb, num);
      });
    }
  };

  $scope.reviewMap = () => {
    $scope.loading = null;
    $scope.review.check = true;
    Map.add($scope.crumbs, $scope.trail.transport)
    .then((data) => {
      $scope.loading = { display: 'none' };
      $scope.trail.map = data.image;
      $scope.trail.time = data.time;
      $scope.trail.length = data.miles;
      moveY($scope.trail, -475);
      $scope.crumbs.forEach((crumb) => {
        moveY(crumb, -400);
      });
      $scope.review.style = {
        'animation-name': 'moveUp',
      };
      $scope.$apply();
    });
  };


  $scope.reset = () => {
    $scope.review.check = false;
    moveReset($scope.trail, 0);
    $scope.crumbs.forEach((crumb, index) => {
      moveReset(crumb, index + 1);
    });
    $scope.review.style = {
      'animation-name': 'moveDown',
    };
  };

  $scope.submit = () => {
    $scope.loading = null;
    $scope.crumbs.pop();
    Trail.submit($scope.trail, $scope.crumbs)
    .then(() => {
      $scope.reset();
      $scope.crumbs = [];
      $scope.trail = trailMaker();
      $scope.loading = { display: 'none' };
      $state.go('app.dashboard');
    })
    ;
  };
});
