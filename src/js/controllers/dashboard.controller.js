angular
  .module('ProjectFour')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = [];
function DashboardCtrl() {
  const vm = this;
  vm.title = 'Dashboard page';
}
