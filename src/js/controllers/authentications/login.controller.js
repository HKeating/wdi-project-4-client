angular
  .module('ProjectFour')
  .controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = [];
function LoginCtrl() {
  const vm = this;

  vm.title = 'Login Here';
}
