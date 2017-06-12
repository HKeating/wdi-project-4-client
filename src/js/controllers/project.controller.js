angular
.module('ProjectFour')
.controller('ProjectCtrl', ProjectCtrl);

let wasShipAnimated = false;

ProjectCtrl.$inject = ['$scope', 'Project', '$stateParams', '$state', 'CurrentUserService', '$rootScope', 'Task', 'Milestone', 'User'];

function ProjectCtrl($scope, Project, $stateParams, $state, CurrentUserService, $rootScope, Task, Milestone, User) {

  const vm = this;
  let dotDistance = 0; // shows how far is the next dot
  const totalDotsLength = [];
  var currentCardPosition;

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


  // $scope.onStart = function(target, source){
  //   console.log('**** ON START  ****');
  // };

  // Dragging the card
  $scope.onDrag = function() {

    if($scope.$card.position().left <= currentCardPosition-5) {
      // Rotating card to left
      $scope.$card.removeClass('taskCardRotatedRight');
      $scope.$card.addClass('taskCardRotatedLeft');
    } else if ($scope.$card.position().left > currentCardPosition+5) {
      // Rotating card to right
      $scope.$card.removeClass('taskCardRotatedLeft');
      $scope.$card.addClass('taskCardRotatedRight');
    }
    // Saving the last position
    currentCardPosition = $scope.$card.position().left;

  };
  $scope.$on('$destroy', function(){
    // Updating some data
    wasShipAnimated = false;
  });

  // $scope.onOver = function(target, source) {
  //
  // };
  //
  // $scope.onOut = function() {
  //   console.log('**** ON OUT ****');
  //   // vm.showDropZone = false;
  //   // console.log('Show drop zone? ', vm.showDropZone);
  //
  // };

  $scope.$completedBox = $('#completedBox');
  $scope.$blockedBox = $('#blockedBox');
  $scope.$destroyBox = $('#destroyBox');

  $scope.onOverCompletedBox = onOverCompletedBox;
  function onOverCompletedBox() {
    $scope.$completedBox.removeClass('completedBox');
    $scope.$completedBox.addClass('completedBoxOver');
  }
  $scope.onOutCompletedBox = onOutCompletedBox;
  function onOutCompletedBox() {
    $scope.$completedBox.removeClass('completedBoxOver');
    $scope.$completedBox.addClass('completedBox');
  }

  $scope.onOverBlockedBox = onOverBlockedBox;
  function onOverBlockedBox() {
    $scope.$blockedBox.removeClass('blockedBox');
    $scope.$blockedBox.addClass('blockedBoxOver');
  }
  $scope.onOutBlockedBox = onOutBlockedBox;
  function onOutBlockedBox() {
    $scope.$blockedBox.removeClass('blockedBoxOver');
    $scope.$blockedBox.addClass('blockedBox');
  }

  $scope.onOverDestroyBox = onOverDestroyBox;
  function onOverDestroyBox() {
    $scope.$destroyBox.removeClass('destroyBox');
    $scope.$destroyBox.addClass('destroyBoxOver');
  }
  $scope.onOutDestroyBox = onOutDestroyBox;
  function onOutDestroyBox() {
    $scope.$destroyBox.removeClass('destroyBoxOver');
    $scope.$destroyBox.addClass('destroyBox');
  }

  $scope.completeTask = completeTask;
  function completeTask() {

    $scope.$card.fadeOut(1000, () => {
      vm.draggedTask.completed = true;
      $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'marked', model1: 'task', preposition: 'as', condition: 'completed'}, vm.draggedTask);
      updateTask(vm.draggedTask);
      vm.draggedTask = {};
      vm.tasksShow = true;
      showCompleted();
    });
  }

  $scope.taskBlocked = taskBlocked;
  function taskBlocked() {
    vm.draggedTask.blocked = true;
    $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'marked', model1: 'task', preposition: 'as', condition: 'blocked'}, vm.draggedTask);
    updateTask(vm.draggedTask);
    vm.draggedTask = {};
    vm.tasksShow = true;
    showBlocked();
  }

  $scope.giveUpTask = giveUpTask;
  function giveUpTask() {
    console.log('You gave up on: ', vm.draggedTask);
    $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'removed', model1: 'task'}, vm.draggedTask);
    deleteTask(vm.draggedTask);
    vm.draggedTask = {};
  }

  $scope.selectTask = selectTask;
  function selectTask(a, b, task) {
    vm.draggedTask = task;
    vm.showDropZone = true;
    vm.statsShow = false;
    vm.tasksShow = false;
    vm.logShow = false;
    $scope.$card = $(`#${task.id}`);

    // Rotating the card
    $scope.$card.addClass('taskCardRotatedRight');
    currentCardPosition = $scope.$card.position().left;

    $scope.$apply();
  }


  $scope.hideDropZone = hideDropZone;
  function hideDropZone() {
    vm.showDropZone = false;

    // Moving card back
    $scope.$card.removeClass('taskCardRotatedLeft');
    $scope.$card.removeClass('taskCardRotatedRight');

    $scope.$apply();
  }



  $rootScope.$on('Project Change', getProject);
  getProject();

  function getProject() {
    Project.get({ id: $stateParams.id}).$promise.then(data => {

      // Got the data about this project
      vm.project = data;
      $rootScope.$project = data;
      vm.user = CurrentUserService.currentUser;
      $rootScope.$broadcast('project ready');
      vm.deadline = vm.project.duration; // setting up deadline
      if (vm.project.user.id === vm.user.id) {
        vm.userIsAdmin = true;
      }
      vm.milestones = data.milestones;
      // vm.projectLogs = data.logs;
      // orderLogs(vm.projectLogs);
      orderLogs(data.logs);
      getStats(data.logs);
      vm.currentDay = getCurrentDay(vm.project.start_date);
      $scope.selectedDay = vm.currentDay;
      vm.project.currentDay = vm.currentDay;
      vm.projectDays = [];
      for (var i = 1; i <= vm.project.duration; i++) {
        vm.projectDays.push(i);
      }
      vm.logDays = [];
      vm.projectLogs.map(log => {
        if (!vm.logDays.includes(log.day)) {
          vm.logDays.push(log.day);
        }
      });
      drawLine();
    });
  }


  // Making refernces to elements in the DOM
  $scope.$line = $('.line');
  $scope.$lineContainer = $('.lineContainer');
  $scope.$dayLabel = $('#dayLabel');

  // $rootScope.$on('project ready', () => {
  //   console.log('tasks: ', vm.project.tasks);
  // });

  // vm.currentDay = 4;
  // $scope.selectedDay = vm.currentDay;
  // This function draws dots on the line
  function drawLine() {
    $scope.$line.empty();

    const lineWidth = $scope.$lineContainer.width();
    const distanceBetweenDots = (lineWidth / vm.deadline);
    dotDistance = distanceBetweenDots;
    const ship = $('<div>');
    const firstDayLabel = $('<div>');
    const currentDayLabel = $('<div>');
    const finalDayLabel = $('<div>');

    let currentLineWidth = 0;
    let shipLineWidth = 0;
    let milestoneIndex = 0;
    $('.lineMilestoneLabel').remove();
    for (let i = 1; i <= vm.deadline; i++) {

      // Making a day dot and adding a class to it
      const dayDot = $('<div>');
      const connectionLine = $('<div>');
      const milestoneLabel = $('<div>');
      // $(ship).css('background-image', 'url(/images/boat.png)');


      // Getting indexes of Milestones
      const arrayOfMilestoneIndexes = [];
      for (const milestone in vm.milestones) {
        arrayOfMilestoneIndexes.push(vm.milestones[milestone].day);
      }

      // console.log('Array of milestone indexes: ',arrayOfMilestoneIndexes);

      if($.inArray(i, arrayOfMilestoneIndexes) !== -1) {

        // It is a milestone
        $(dayDot).addClass('lineMilestone');
        $(milestoneLabel).addClass('lineMilestoneLabel');
        $(milestoneLabel).html(vm.milestones[milestoneIndex].title);
        $scope.$lineContainer.append(milestoneLabel);
        $(milestoneLabel).css({top: $scope.$lineContainer.height()-150, left: currentLineWidth-30, position: 'absolute'});

        milestoneIndex++;

        $(dayDot).hover(function() {
          $(milestoneLabel).addClass('lineMilestoneLabelHover');
        }, function() {
          $(milestoneLabel).removeClass('lineMilestoneLabelHover');
        }
      );

      } else {

        if(i === 1) {
          // The First dot
          $(dayDot).attr('id', `lineStartDot`);
          $(firstDayLabel).addClass('lineLabel');
          $(firstDayLabel).html('Day 1');
          $(firstDayLabel).css({top: $scope.$lineContainer.height()-5, left: currentLineWidth, position: 'absolute'});

          // if first day is current day, add ship to the first day
          if(!wasShipAnimated && vm.currentDay === i) {
            $(ship).attr('id', `icon`);
            shipLineWidth = 0;
            $(ship).css({top: $scope.$lineContainer.height() - 110, left: 0, position: 'absolute'});
            $scope.$lineContainer.append(ship);
          }

          if(!wasShipAnimated) $scope.$lineContainer.append(firstDayLabel);

        } else if (i === vm.deadline) {
          // The Last dot
          $(dayDot).attr('id', `lineDeadlineDot`);

          $(finalDayLabel).addClass('lineLabel');
          $(finalDayLabel).html(`Day ${vm.deadline}`);
          $(finalDayLabel).css({top: $scope.$lineContainer.height()-5, left: currentLineWidth, position: 'absolute'});
          if(!wasShipAnimated) $scope.$lineContainer.append(finalDayLabel);

        } else if (i === vm.currentDay) {
          // The Current dot
          $(dayDot).attr('id', `lineCurrentDot`);

          $(currentDayLabel).addClass('lineLabel');
          $(currentDayLabel).html(`Day ${vm.currentDay}`);
          $(currentDayLabel).css({top: $scope.$lineContainer.height()-5, left: currentLineWidth, position: 'absolute'});
          if(!wasShipAnimated) $scope.$lineContainer.append(currentDayLabel);

          $(ship).attr('id', `icon`);
          shipLineWidth = currentLineWidth;
          if(!wasShipAnimated) {
            $(ship).css({top: $scope.$lineContainer.height() - 110, left: 0, position: 'absolute'});
            $scope.$lineContainer.append(ship);
          }


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
      $(connectionLine).css('margin', `7px 0`);


      // Inserting all new elements in HTML
      $scope.$line.append(dayDot);
      if (i !== vm.deadline)  $scope.$line.append(connectionLine);

      console.log(`${i}) Dot width: `, dayDot.width());
      console.log(`${i}) Line width: `, connectionLine.width());
      currentLineWidth = currentLineWidth + connectionLine.width() + dayDot.width();
      totalDotsLength.push(dayDot.width());
    }

    // After the loop
    $scope.$line.css('margin', '0 auto');

    if(!wasShipAnimated) {
      wasShipAnimated = true;
      $(ship).animate({
        left: shipLineWidth
      }, 1500);
    } else {
      console.log('Ship was animated');
    }
  }

  // This functions do HOVER on Task Cards
  vm.taskMouseOver = function taskMouseOver(task) {

    let allDotsWidth = 0;
    let lastDotWidth = 0;
    const startDay = task.start_day;

    // Calculating starting position
    for(var i = 0; i < startDay; i++) {
      allDotsWidth = allDotsWidth + totalDotsLength[i];
      lastDotWidth = totalDotsLength[i];
    }

    // Calculating the total length of the line between two dots
    const dueDay = task.due_day;
    const totalDaysBetweenTwoDots = dueDay-startDay;
    const distanceBetweenDots = totalDaysBetweenTwoDots * dotDistance + allDotsWidth - (lastDotWidth/2);

    const startPosition = (startDay-1) * dotDistance + allDotsWidth;

    const linkLine = $('<div>');
    linkLine.addClass('lineLink');
    linkLine.css({top: $scope.$lineContainer.height()-45, left: startPosition, position: 'absolute'});
    linkLine.width(distanceBetweenDots);
    console.log(linkLine);
    $scope.$lineContainer.append(linkLine);
  };


  vm.taskMouseLeave = function taskMouseLeave() {
    $('.lineLink').remove();
  };

  // vm.taskColors = ['#e74c3c', '#2ecc71', '#3498db', '#34495e', '#1abc9c', '#9b59b6', '#f1c40f', '#f39c12'];
  vm.taskColors = [{name: 'Red', color: 'e74c3c'},{name: 'Green', color: '2ecc71'}, {name: 'Blue', color: '3498db'}, {name: 'Dark Blue', color: '34495e'}, {name: 'Aqua', color: '1abc9c'}, {name: 'Purple', color: '9b59b6'}, {name: 'Yellow', color: 'f1c40f'}, {name: 'Orange', color: 'f39c12'}, {name: 'Default', color: 'ecf0f1'}];

  vm.createTask = createTask;
  function createTask() {
    vm.newTask.project_id = vm.project.id;
    vm.newTask.start_day = $scope.selectedDay;
    vm.newTask.completed = false;
    vm.newTask.blocked = false;
    if (!vm.newTask.due_day) {
      vm.newTask.due_day = vm.project.duration;
    }
    if (!vm.newTask.color) {
      vm.newTask.color = 'ecf0f1';
    }
    const taskObj = {
      'task': vm.newTask
    };
    console.log('Sending task: ', taskObj);
    Task
    .save(taskObj)
    .$promise
    .then((data) => {
      console.log('New task created: ', data);
      $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'created', model1: 'task'}, data);
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
      $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'assigned', model1: 'user', preposition: 'to', model2: 'task'}, userToAdd, task);
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
    $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'removed', model1: 'user', preposition: 'from', model2: 'task'}, userToRemove, task);
    updateTask(task);
  }

  vm.unblockTask = unblockTask;
  function unblockTask(task) {
    task.blocked = false;
    $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'marked', model1: 'task', preposition: 'as', condition: 'unblocked'}, task);
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
      // $scope.$apply();
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

  vm.getTaskColor = getTaskColor;
  function getTaskColor(task) {
    console.log('Getting task color', task.color);
    return `#${task.color}`;
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
      $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'added', model1: 'milestone'}, data);
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
      $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'added', model1: 'task', preposition: 'to', model2: 'milestone'}, taskToAdd, milestone);
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
    $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'removed', model1: 'task', preposition: 'from', model2: 'milestone'}, taskToRemove, milestone);
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

  vm.deleteMilestone = deleteMilestone;
  function deleteMilestone(milestone) {
    Milestone
    .remove({ id: milestone.id })
    .$promise
    .then(() => {
      console.log('Milestone successfully destroyed');
      $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'removed', model1: 'milestone'}, milestone);
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
      $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'removed', model1: 'user', preposition: 'as a', condition: 'contributor'}, userToRemove);
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
      $rootScope.$broadcast('Log', vm.project, vm.user, {action: 'added', model1: 'user', preposition: 'as a', condition: 'contributor'}, userToAdd);
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

  vm.tasksShow = true;
  vm.blockedShow = true;
  vm.showStats = showStats;
  function showStats() {
    $('.statsButton').addClass('selectedButton');
    $('.tasksButton').removeClass('selectedButton');
    $('.logButton').removeClass('selectedButton');
    vm.statsShow = true;
    vm.tasksShow = false;
    vm.logShow = false;
  }
  vm.showTasks = showTasks;
  function showTasks() {
    $('.statsButton').removeClass('selectedButton');
    $('.tasksButton').addClass('selectedButton');
    $('.logButton').removeClass('selectedButton');
    vm.statsShow = false;
    vm.tasksShow = true;
    vm.logShow = false;
  }
  vm.showLog = showLog;
  function showLog() {
    $('.statsButton').removeClass('selectedButton');
    $('.tasksButton').removeClass('selectedButton');
    $('.logButton').addClass('selectedButton');
    vm.statsShow = false;
    vm.tasksShow = false;
    vm.logShow = true;
  }
  vm.showCompleted = showCompleted;
  function showCompleted() {
    vm.completedShow = true;
    vm.blockedShow = false;
    $('.completedHeader').addClass('completedHeaderSelected');
    $('.blockedHeader').removeClass('blockedHeaderSelected');
  }
  vm.showBlocked = showBlocked;
  function showBlocked() {
    vm.completedShow = false;
    vm.blockedShow = true;
    $('.completedHeader').removeClass('completedHeaderSelected');
    $('.blockedHeader').addClass('blockedHeaderSelected');
  }



  vm.convertDate = convertDate;
  function convertDate(date) {
    const parsedDate = new Date(date);
    const displayDate = parsedDate.toLocaleTimeString();
    // const displayDate = parsedDate.toLocaleDateString() + ' ' + parsedDate.toLocaleTimeString();
    return displayDate;
  }

  vm.getCurrentDay = getCurrentDay;
  function getCurrentDay(date) {
    const startDate = new Date(date);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

  vm.orderLogs = orderLogs;
  function orderLogs(logs) {
    vm.projectLogs = logs.sort((a, b) => {
      return new Date(a.created_at) - new Date(b.created_at);
    });
  }

  $rootScope.$on('New Log', getProject);

  vm.getStats = getStats;
  function getStats(logs) {
    console.log('Number of logs: ', logs.length);
    vm.totalTasks = 0;
    vm.totalTasksCompleted = 0;
    vm.totalTasksDeleted = 0;
    vm.activeUsers = [];
    logs.map(log => {
      if (!vm.activeUsers.find(x => x.id === log.user.id)) {
        log.user.tasksCompleted = 0;
        log.user.tasksDeleted = 0;
        vm.activeUsers.push(log.user);
      }
      if (log.details.action === 'created' && log.details.model1 === 'task') {
        vm.totalTasks ++;
      } else if (log.details.action === 'marked' && log.details.condition === 'completed') {
        (vm.activeUsers.find(x => x.id === log.user.id)).tasksCompleted ++;
        vm.totalTasksCompleted ++ ;
      } else if (log.details.action === 'removed' && log.details.model1 === 'task') {
        (vm.activeUsers.find(x => x.id === log.user.id)).tasksDeleted ++;
        vm.totalTasksDeleted ++;
      }

    });
  }































}
