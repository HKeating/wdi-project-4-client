angular
  .module('ProjectFour')
  .controller('ProjectCtrl', ProjectCtrl);

ProjectCtrl.$inject = [];
function ProjectCtrl() {
  const vm = this;
  vm.title = 'Project page';
  vm.days = 7;

  vm.milestones = [
    {
      deadline: 3,
      title: 'MVP'
    },
    {
      deadline: 5,
      title: 'Beta'
    }
  ];

  

}
