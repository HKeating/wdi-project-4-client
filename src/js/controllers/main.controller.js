angular
  .module('ProjectFour')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = [];
function MainCtrl() {
  const vm = this;
  vm.test = 'Hello';
}
