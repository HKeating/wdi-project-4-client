angular
.module('ProjectFour')
.controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', 'CurrentUserService', '$state', '$scope'];
function MainCtrl($rootScope, CurrentUserService, $state, $scope) {
  const vm = this;

  vm.test = 'Hello';

  CurrentUserService.getUser();



  $rootScope.$on('loggedIn', () => {
    vm.user = CurrentUserService.currentUser;
  });
  vm.logout = () => {
    CurrentUserService.removeUser();
  };
  $rootScope.$on('loggedOut', () => {
    vm.user = null;
    $state.go('login');
  });

  vm.goToUserProfile = () => {
    $state.go('profile');
  };

  $scope.$state = $state;

  //var container = document.getElementById('container');

  // var square1 = document.getElementById('square1');
  // var movingShip = document.getElementById('movingShip');


  // $scope.$square1 = $('#square1');
  // $scope.$movingShip = $('#movingShip');

  // $scope.$square1 = $('#square1');
  // $scope.$movingShip = $('#movingShip');
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var scrollArea = 0 - windowHeight;
  //
  // console.log('SQUARE 2!!!!!', movingShip);

  // update position of square 1 and square 2 when scroll event fires.
  window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || window.scrollTop;
    var scrollPercent = scrollTop/scrollArea || 0;
    console.log(movingShip.style.left);

    // square1.style.left = scrollPercent * windowWidth + 'px';
    movingShip.style.left = 0 - scrollPercent*windowWidth * 0.25 + 'px';

    // if (parseInt(movingShip.style.left) > 870) {
    //   movingShip.style = 150 - scrollPercent*windowWidth;
    // }

  });

}
