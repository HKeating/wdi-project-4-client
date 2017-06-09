angular
.module('ProjectFour')
.controller('ProfileCtrl', ProfileCtrl);

ProfileCtrl.$inject = ['$scope', 'Project', '$stateParams', '$state', 'CurrentUserService', '$rootScope', 'Task', 'User'];

function ProfileCtrl($scope, Profile, $stateParams, $state, CurrentUserService, $rootScope, Task, User) {

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
















  vm.updateUser = updateUser;
  function updateUser(user) {
    const userObj = { 'user': user };
    User
    .update({id: user.id}, userObj)
    .$promise
    .then(data => {
      console.log('User updated: ', data);
      $rootScope.$broadcast('User Change');
    });
  }
}
