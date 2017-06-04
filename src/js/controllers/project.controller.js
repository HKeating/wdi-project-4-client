angular
.module('ProjectFour')
.controller('ProjectCtrl', ProjectCtrl);

ProjectCtrl.$inject = ['$scope'];

function ProjectCtrl($scope) {

  const vm = this;

  vm.title = 'Project page';

  vm.deadline = 12;
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
  vm.currentDay = 5;

  $scope.$line = $('.line');

  // This function draws dots on the line
  function drawLine() {

    console.log(`Line width is ${$scope.$line.width()}`);
    const lineWidth = $scope.$line.width();
    const distanceBetweenDots = (lineWidth / vm.deadline) - 20;

    for (let i = 1; i <= vm.deadline; i++) {

      // Making a day dot and adding a class to it
      const dayDot = document.createElement('div');
      const connectionLine = document.createElement('div');

      $(dayDot).addClass('lineDayDot');

      if(i === 1) {
        // The first dot
        $(dayDot).attr('id', `lineStartDot`);

      } else if (i === vm.deadline) {
        // The last dot
        $(dayDot).attr('id', `lineDeadlineDot`);

      } else {
        // Any other dot
        $(dayDot).attr('id', `lineDot${i}`);
      }

      // Finding the current dot
      if (i === vm.currentDay) {
        $(dayDot).css({'border-color': 'blue',
          'border-width': '3px',
          'border-style': 'solid'});
      }

      // Adding connection lines
      if (i < vm.currentDay) {
        $(connectionLine).addClass('linePast');
        $(dayDot).css('background-color', 'green');
      } else {
        $(connectionLine).addClass('lineFuture');
      }

      $(connectionLine).css('width', `${distanceBetweenDots}px`);
      $(connectionLine).css('height', `5px`);
      $(connectionLine).css('margin', `7px 0`);

      // Inserting all new elements in HTML
      $scope.$line.append(dayDot);
      if (i !== vm.deadline)
        $scope.$line.append(connectionLine);
    }

  }

  drawLine();
}
