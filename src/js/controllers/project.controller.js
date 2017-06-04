angular
  .module('ProjectFour')
  .controller('ProjectCtrl', ProjectCtrl);

ProjectCtrl.$inject = ['$scope'];

function ProjectCtrl($scope) {

  const vm = this;

  vm.title = 'Project page';

  vm.deadline = 7;
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
  vm.currentDay = 2;

  $scope.$line = $('.line');

  function drawDayPoints() {
    console.log(`Line width is ${$scope.$line.width()}`);
  }

  drawDayPoints();
}
