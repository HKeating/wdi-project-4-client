angular
.module('ProjectFour')
.controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['$scope', 'Project', '$stateParams', '$state', 'CurrentUserService', '$rootScope', 'Task'];

function ProfileCtrl($scope, Profile, $stateParams, $state, CurrentUserService, $rootScope) {

  const vm = this;

  vm.user = CurrentUserService.currentUser;


  $rootScope.$on('loggedIn', () => {
    if(!vm.user) {
      vm.user = CurrentUserService.currentUser;
    }

  });

  vm.logOut = () => {
    CurrentUserService.removeUser();
  };

}
