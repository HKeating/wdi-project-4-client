angular
.module('ProjectFour')
.controller('ProjectCtrl', ProjectCtrl);

ProjectCtrl.$inject = ['$scope', 'Project', '$stateParams', '$state', 'CurrentUserService'];

function ProjectCtrl($scope, Project, $stateParams, $state, CurrentUserService) {
  const vm = this;
  vm.user = CurrentUserService.currentUser;
  vm.project = Project.get($stateParams);
  console.log('Project: ', vm.project);
  console.log('User: ', $scope.user);
  // Redirect if no current user. Having trouble with check for current user being creator of project
  if (!vm.user) $state.go('fuckOff');
  vm.title = 'Project page';

  vm.deadline = 12;
  // vm.deadline = vm.project.duration;
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
  $scope.$dayLabel = $('#dayLabel');

  // This function draws dots on the line
  function drawLine() {

    console.log(`Line width is ${$scope.$line.width()}`);
    const lineWidth = $scope.$line.width();
    const distanceBetweenDots = (lineWidth / vm.deadline) - 20;

    for (let i = 1; i <= vm.deadline; i++) {

      // Making a day dot and adding a class to it
      const dayDot = $('<div>');
      const connectionLine = $('<div>');

      //$(dayDot).addClass('lineDayDot');

      if(i === 1) {
        // The First dot
        $(dayDot).attr('id', `lineStartDot`);

      } else if (i === vm.deadline) {
        // The Last dot
        $(dayDot).attr('id', `lineDeadlineDot`);

      } else if (i === vm.currentDay) {
        // The Current dot
        $(dayDot).attr('id', `lineCurrentDot`);

      } else {
        // Any other dot
        $(dayDot).attr('id', `lineDot${i}`);

        if(i < vm.currentDay) {
          // Dot BEFORE current day
          $(dayDot).addClass('linePastDayDot');
        } else {
          // Dot AFTER current day
          $(dayDot).addClass('lineDayDot');
        }
      }

      $(dayDot).attr('index', `${i}`);


      $(dayDot).hover(

        function() {
          console.log('HOVER!');
          // $(this).removeClass();
          // $(this).addClass('lineDotSelected');
          $scope.$dayLabel.html(`Day ${$(this).attr('index')}`);
        }, function() {
        // $(this).removeClass('lineDotSelected');
        $scope.$dayLabel.html('');
      });

      // Adding connection lines
      if (i < vm.currentDay) {
        $(connectionLine).addClass('linePast');
      } else {
        $(connectionLine).addClass('lineFuture');
      }

      $(connectionLine).css('width', `${distanceBetweenDots}px`);
      $(connectionLine).css('height', `3px`);
      $(connectionLine).css('margin', `6px 0`);

      // Inserting all new elements in HTML
      $scope.$line.append(dayDot);
      if (i !== vm.deadline)
        $scope.$line.append(connectionLine);
    }

  }

  drawLine();
}
