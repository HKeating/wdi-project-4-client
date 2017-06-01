angular
  .module('ProjectFour')
  .controller('RegisterCtrl', RegisterCtrl);

RegisterCtrl.$inject = ['User', 'CurrentUserService', '$state'];
function RegisterCtrl(User, CurrentUserService, $state) {
  const vm = this;

  vm.title = 'Register Here';

  vm.register = () => {
    User
      .register(vm.user)
      .$promise
      .then(() => {
        CurrentUserService.getUser();
        $state.go('home');
      }, err => {
        console.log('RegisterCtrl error: ', err);
      });
  };
}
