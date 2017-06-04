angular
  .module('ProjectFour')
  .controller('ProjectCtrl', ProjectCtrl);

ProjectCtrl.$inject = [];
function ProjectCtrl() {
  const vm = this;
  vm.title = 'Project page';
}
