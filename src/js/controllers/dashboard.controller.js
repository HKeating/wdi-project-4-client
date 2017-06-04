angular
  .module('ProjectFour')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['CurrentUserService', '$rootScope'];
function DashboardCtrl(CurrentUserService, $rootScope) {
  const vm = this;
  vm.title = 'Dashboard page';
  vm.user = CurrentUserService.currentUser;
  if(!vm.user) {
    $rootScope.$on('loggedIn', () => {
      vm.user = CurrentUserService.currentUser;
    });
  }
  vm.projects = vm.user.projects;


}
