angular
  .module('ProjectFour')
  .controller('RegisterCtrl', RegisterCtrl);

RegisterCtrl.$inject = [];
function RegisterCtrl() {
  const vm = this;

  vm.title = 'Register Here';
}
