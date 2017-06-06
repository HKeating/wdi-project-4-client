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

}
