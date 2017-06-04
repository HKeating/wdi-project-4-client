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
  vm.currentDay = 2;

  $scope.$line = $('.line');

  // This function draws dots on the line
  function drawDayPoints() {

    console.log(`Line width is ${$scope.$line.width()}`);
    const lineWidth = $scope.$line.width();
    const distanceBetweenDots = (lineWidth / vm.deadline) - 20;
    //let dayDot = ('<div class='sparkLine' id='id1'></div>')

    for (let i = 1; i <= vm.deadline; i++) {
      const dayDot = document.createElement('div');
      $(dayDot).addClass('lineDayDot');

      if(i === 1) {
        // The first dot
        $(dayDot).attr('id', `lineStartDot`);

      } else if (i === vm.deadline) {
        // The last dot
        $(dayDot).attr('id', `lineDeadlineDot`).css('margin-left', `${distanceBetweenDots}px`);

      } else {
        // Any other dot
        $(dayDot).attr('id', `lineDot${i}`).css('margin-left', `${distanceBetweenDots}px`);
      }

      if (i === vm.currentDay) {
        $(dayDot).css({'border-color': 'white',
          'border-width': '3px',
          'border-style': 'solid'});
      }

      $scope.$line.append(dayDot);
    }

  }
  // .css( { marginLeft : '200px', marginRight : '200px' } );

  drawDayPoints();
}
