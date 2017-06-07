/*
1) Horace CREATED A *project name* PROJECT
2) Horace ADDED *username* AS A CONTRIBUTOR
3) Horace RENAMED THE PROJECT TO *project name*
4) Horace ADDED *task name* as a task from *day* untill *day*
5) Horace ASSIGNED *username* to task *task name*
6) Horace CREATED A *milestone name* due *day*
7) Horace ADDED *task name* to *milestone name*
8) Horace REMOVED *task name* from *milestone name*
9) Horace REMOVED *milestone name*
10) Horace REMOVED *username* AS A CONTRIBUTOR
11) Horace MARKED *task name* AS COMPLETED
12) Horace MARKED *task name* AS BUGGED
13) Horace GAVE UP ON *task name*
14) MILESTONE *milestone name* WAS COMPLETED
15) MILESTONE *milestone name* DEADLINE MISSED, *number* TASKS NOT COMPLETED
16) DAY *currentDay* BEGAN

*/
angular
.module('ProjectFour')
.controller('ProjectCtrl', ProjectCtrl);

ProjectCtrl.$inject = ['$scope', 'Project', '$stateParams', '$state', 'CurrentUserService', '$rootScope', 'Task', 'Milestone', 'User'];

function ProjectCtrl($scope, Project, $stateParams, $state, CurrentUserService, $rootScope, Task, Milestone, User) {
  const vm = this;
  // vm.showDropZone = false;
  // Drag and Drop call backs
  // $scope.onDrop = function(target, source){
  //   console.log('**** ON DROP  ****');
  //   console.log('Target: ', target);
  //   console.log('Source: ', source);
  //   console.log();
  //   // var obj = source.draggable.$scope();
  //   // console.log('Scope: ', obj);
  //   // var objDragItem = source.draggable.$scope().dndDragItem;
  //   // console.log('Scope: ', objDragItem);
  // };
  $scope.onStart = function(target, source){
    console.log('**** ON START  ****');
  };

  $scope.onDrag = function(target, source){
    // console.log('**** ON DRAG  ****');
    // console.log('Target: ', target);
    // console.log('Source: ', source);
  };

  $scope.onOver = function() {
    console.log('**** ON OVER ****');
    // vm.showDropZone = true;
    // console.log('Show drop zone? ', vm.showDropZone);

  };

  $scope.onOut = function() {
    console.log('**** ON OUT ****');
    // vm.showDropZone = false;
    // console.log('Show drop zone? ', vm.showDropZone);

  };

  $scope.completeTask = completeTask;
  function completeTask() {
    console.log('Task completed: ', vm.draggedTask);
    vm.draggedTask.completed = true;
    updateTask(vm.draggedTask);
    vm.draggedTask = {};
  }
  $scope.taskBlocked = taskBlocked;
  function taskBlocked() {
    console.log('Task blocked: ', vm.draggedTask);
    vm.draggedTask.blocked = true;
    updateTask(vm.draggedTask);
    vm.draggedTask = {};
  }
  $scope.giveUpTask = giveUpTask;
  function giveUpTask() {
    console.log('You gave up on: ', vm.draggedTask);
    deleteTask(vm.draggedTask);
    vm.draggedTask = {};
  }

  $scope.selectTask = selectTask;
  function selectTask(a, b, task) {
    console.log('Task: ', task);
    vm.draggedTask = task;
    vm.showDropZone = true;
    console.log('Show drop zone? ', vm.showDropZone);
    $scope.$apply();
  }


  $scope.hideDropZone = hideDropZone;
  function hideDropZone() {
    console.log('Hidedrop triggering');
    vm.showDropZone = false;
    $scope.$apply();
  }




  // if (!vm.user) $state.go('fuckOff');
  getProject();

  // vm.getProject = getProject;
  function getProject() {
    Project.get({ id: $stateParams.id}).$promise.then(data => {

      // Got the data about this project
      vm.project = data;
      vm.user = CurrentUserService.currentUser;
      console.log('Got the data', vm.project);
      $rootScope.$broadcast('project ready');
      vm.deadline = vm.project.duration; // setting up deadline
      if (vm.project.user.id === vm.user.id) {
        vm.userIsAdmin = true;
      }
      // vm.milestones = [
      //   {
      //     deadline: 3,
      //     title: 'MVP'
      //   },
      //   {
      //     deadline: 5,
      //     title: 'Beta'
      //   }
      // ];
      vm.milestones = data.milestones;

      drawLine();
    });
  }


  // Making refernces to elements in the DOM
  $scope.$line = $('.line');
  $scope.$dayLabel = $('#dayLabel');
  // console.log('The line is ', $scope.$dayLabel);

  // $rootScope.$on('project ready', () => {
  //   console.log('tasks: ', vm.project.tasks);
  // });

  vm.currentDay = 4;
  $scope.selectedDay = vm.currentDay;
  // This function draws dots on the line
  function drawLine() {
    $('.line').empty();
    console.log(`Line width is ${$scope.$line.width()}`);
    const lineWidth = $scope.$line.width();
    const distanceBetweenDots = (lineWidth / vm.deadline);

    for (let i = 1; i <= vm.deadline; i++) {

      // Making a day dot and adding a class to it
      const dayDot = $('<div>');
      const connectionLine = $('<div>');

      // Getting indexes of Milestones
      const arrayOfMilestoneIndexes = [];
      for (const milestone in vm.milestones) {
        arrayOfMilestoneIndexes.push(vm.milestones[milestone].day);
      }

      // console.log('Array of milestone indexes: ',arrayOfMilestoneIndexes);

      if($.inArray(i, arrayOfMilestoneIndexes) !== -1) {
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

      $(connectionLine).css('width', `${distanceBetweenDots-15}px`);
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
    vm.newTask.completed = false;
    vm.newTask.blocked = false;
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

  vm.addTaskUser = addTaskUser;
  function addTaskUser(task, userToAdd) {
    task.user_ids = [];
    task.users.map(user => {
      task.user_ids.push(user.id);
    });
    if (task.user_ids.includes(userToAdd.id)) {
      console.log('user already added');
    } else {
      task.user_ids.push(userToAdd.id);
      updateTask(task);
    }
  }

  vm.removeTaskUser = removeTaskUser;
  function removeTaskUser(task, userToRemove) {
    task.user_ids = [];
    task.users.map(user => {
      if (user.id !== userToRemove.id) {
        task.user_ids.push(user.id);
      }
    });
    updateTask(task);
  }
  vm.updateTask = updateTask;
  function updateTask(task) {
    const taskObj = { 'task': task };
    console.log('new task: ', task);
    Task
    .update({id: task.id }, taskObj)
    .$promise
    .then(data => {
      console.log('Task updated: ', data);
      $rootScope.$broadcast('Task Change');
    });
  }

  vm.deleteTask = deleteTask;
  function deleteTask(task) {
    Task
    .remove({ id: task.id })
    .$promise
    .then(() => {
      console.log('Task successfully destroyed');
      $rootScope.$broadcast('Task Change');
    });
  }

  vm.showTaskEditForm = false;
  vm.selectTaskToEdit = selectTaskToEdit;
  function selectTaskToEdit(taskId) {
    vm.showTaskEditForm = true;
    vm.taskToUpdate = Task.get({id: taskId});
  }

  vm.hideTaskEditForm = hideTaskEditForm;
  function hideTaskEditForm() {
    vm.showTaskEditForm = false;
    vm.taskToUpdate = {};
  }

  $rootScope.$on('Task Change', () => {
    vm.newTask = {};
    getProject();
    if(vm.taskToUpdate) {
      vm.taskToUpdate = Task.get({id: vm.taskToUpdate.id});
    }
  });


  vm.createMilestone = createMilestone;
  function createMilestone() {
    vm.newMilestone.project_id = vm.project.id;
    const milestoneObj = {
      'milestone': vm.newMilestone
    };
    console.log('Sending milestone: ', milestoneObj);
    Milestone
    .save(milestoneObj)
    .$promise
    .then((data) => {
      console.log('New milestone created: ', data);
      $rootScope.$broadcast('Milestone Change');
    });
  }

  vm.selectMilestoneToUpdate = selectMilestoneToUpdate;
  function selectMilestoneToUpdate(milestoneId) {
    Milestone.get({id: milestoneId})
    .$promise
    .then(data => {
      vm.milestoneToUpdate = data;
      vm.milestoneToUpdate.availableTasks = [];
      vm.project.tasks.map(task => {
        if ((vm.milestoneToUpdate.day>=task.due_day) && !(vm.milestoneToUpdate.tasks.find(x => x.id === task.id))) {
          vm.milestoneToUpdate.availableTasks.push(task);
        }
      });
    });
  }

  vm.addMilestoneTask = addMilestoneTask;
  function addMilestoneTask(milestone, taskToAdd) {
    milestone.task_ids = [];
    milestone.tasks.map(task => {
      milestone.task_ids.push(task.id);
    });
    if (milestone.task_ids.includes(taskToAdd.id)) {
      console.log('task already added');
    } else {
      milestone.task_ids.push(taskToAdd.id);
      updateMilestone(milestone);
    }
  }

  vm.checkTask = checkTask;
  function checkTask(milestone, task) {
    milestone.tasks.find(x => x.id === task.id);
  }

  vm.removeMilestoneTask = removeMilestoneTask;
  function removeMilestoneTask(milestone, taskToRemove) {
    milestone.task_ids = [];
    milestone.tasks.map(task => {
      if (task.id !== taskToRemove.id) {
        milestone.task_ids.push(task.id);
      }
    });
    updateMilestone(milestone);
  }

  vm.updateMilestone = updateMilestone;
  function updateMilestone(milestone) {
    const milestoneObj = { 'milestone': milestone };
    console.log('new milestone: ', milestone);
    Milestone
    .update({id: milestone.id }, milestoneObj)
    .$promise
    .then(data => {
      console.log('Milestone updated: ', data);
      $rootScope.$broadcast('Milestone Change');
    });
  }

  $rootScope.$on('Milestone Change', () => {
    vm.newMilestone = {};
    getProject();
    selectMilestoneToUpdate(vm.milestoneToUpdate.id);
  });

  vm.allUsers = User.query();

  vm.removeCollaborator = removeCollaborator;
  function removeCollaborator(userToRemove) {
    vm.project.user_ids = [];
    vm.project.users.map(user => {
      vm.project.user_ids.push(user.id);
    });
    if (vm.project.user_ids.length === 1) {
      return console.log('There must be at least one collaborator');
    } else {
      vm.project.user_ids.splice(vm.project.user_ids.indexOf(userToRemove.id), 1);
      updateProject(vm.project);
    }

  }

  vm.addCollaborator = addCollaborator;
  function addCollaborator(userToAdd) {
    vm.project.user_ids = [];
    vm.project.users.map(user => {
      vm.project.user_ids.push(user.id);
    });
    if (!vm.project.user_ids.includes(userToAdd.id)) {
      vm.project.user_ids.push(userToAdd.id);
      updateProject(vm.project);
    } else {
      console.log('User already on project');
    }
  }

  vm.updateProject = updateProject;
  function updateProject(project) {
    console.log('Project to send to back end: ', project);
    // if (vm.editForm.$valid) {
    const projectObj = { 'project': project };
    Project
    .update({id: project.id }, projectObj)
    .$promise
    .then(() => {
      $rootScope.$broadcast('Project Change');
      vm.showEditForm = false;
    });
    // }
  }

  $rootScope.$on('Project Change', () => {
    getProject();
  });

}
