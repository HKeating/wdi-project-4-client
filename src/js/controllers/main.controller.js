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
  // var square2 = document.getElementById('square2');


  // $scope.$square1 = $('#square1');
  // $scope.$square2 = $('#square2');

  // $scope.$square1 = $('#square1');
  // $scope.$square2 = $('#square2');
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var scrollArea = 0 - windowHeight;

  // update position of square 1 and square 2 when scroll event fires.
  window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || window.scrollTop;
    var scrollPercent = scrollTop/scrollArea || 0;

    square1.style.left = scrollPercent * windowWidth + 'px';
    square2.style.left = 100 - scrollPercent*windowWidth * 0.5 + 'px';
  });

}
