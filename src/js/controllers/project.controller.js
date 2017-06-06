angular
.module('ProjectFour')
.controller('ProjectCtrl', ProjectCtrl);

ProjectCtrl.$inject = ['$scope', 'Project', '$stateParams', '$state', 'CurrentUserService', '$rootScope', 'Task'];

function ProjectCtrl($scope, Project, $stateParams, $state, CurrentUserService, $rootScope, Task) {
  const vm = this;

  vm.user = CurrentUserService.currentUser;

  // if (!vm.user) $state.go('fuckOff');

  vm.project = Project.get({ id: $stateParams.id}).$promise.then(data => {

    // Got the data about this project
    vm.project = data;
    console.log('Got the data', vm.project);
    $rootScope.$broadcast('project ready');
    vm.deadline = vm.project.duration; // setting up deadline

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

    drawLine();
  });

  // Making refernces to elements in the DOM
  $scope.$line = $('.line');
  $scope.$dayLabel = $('#dayLabel');

  // $rootScope.$on('project ready', () => {
  //   console.log('tasks: ', vm.project.tasks);
  // });

  vm.currentDay = 4;
  $scope.selectedDay = vm.currentDay;
  // This function draws dots on the line
  function drawLine() {

    console.log(`Line width is ${$scope.$line.width()}`);
    const lineWidth = $scope.$line.width();
    const distanceBetweenDots = (lineWidth / vm.deadline) - 20;

    for (let i = 1; i <= vm.deadline; i++) {

      // Making a day dot and adding a class to it
      const dayDot = $('<div>');
      const connectionLine = $('<div>');

      // Getting indexes of Milestones
      const arrayOfMilestoneIndexes = [];
      for (const milestone in vm.milestones) {
        //console.log(vm.milestones[milestone]);
        arrayOfMilestoneIndexes.push(vm.milestones[milestone].deadline);
      }
      console.log('Array of milestone indexes: ',arrayOfMilestoneIndexes);

      if($.inArray(i-1, arrayOfMilestoneIndexes) !== -1) {
        // It is a milestone
        $(dayDot).addClass('lineMilestone');

      } else {

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
      }

      $(dayDot).attr('index', `${i}`);

      $(dayDot).click(() =>  {
        console.log('clicked');

        $scope.selectedDay = dayDot.attr('index');
        console.log('selectedDay: ', $scope.selectedDay);

        $scope.$apply();
      });

      // $(dayDot).hover(
      //
      //   function() {
      //     const dayIndex = $(this).attr('index');
      //     if(dayIndex == vm.deadline)
      //       $scope.$dayLabel.html('FUCKING DEADLINE');
      //     else
      //       $scope.$dayLabel.html(`Day ${dayIndex}`);
      //
      //   }, function() {
      //     // $(this).removeClass('lineDotSelected');
      //   $scope.$dayLabel.html('');
      // });

      // Adding connection lines
      if (i < vm.currentDay) {
        $(connectionLine).addClass('linePast');
      } else {
        $(connectionLine).addClass('lineFuture');
      }

      $(connectionLine).css('width', `${distanceBetweenDots}px`);
      $(connectionLine).css('height', `3px`);
      $(connectionLine).css('margin', `7px 0`);



      // Inserting all new elements in HTML
      $scope.$line.append(dayDot);
      if (i !== vm.deadline)
        $scope.$line.append(connectionLine);
    }

  }
















  vm.createTask = createTask;
  function createTask() {
    vm.newTask.project_id = vm.project.id;
    vm.newTask.start_day = $scope.selectedDay;
    const taskObj = {
      'task': vm.newTask
    };
    console.log('Sending task: ', taskObj);
    Task
    .save(taskObj)
    .$promise
    .then((data) => {
      console.log('New task created: ', data);
      $rootScope.$broadcast('Task Change');
    });
  }

  $rootScope.$on('Task Change', () => {
    vm.newTask = {};
    // $('.lookupField').val('');
  });

}
