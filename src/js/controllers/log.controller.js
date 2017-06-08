angular
  .module('ProjectFour')
  .controller('LogCtrl', LogCtrl);

LogCtrl.$inject = ['$rootScope', 'Log'];
function LogCtrl($rootScope, Log) {
/*
  1) *username* CREATED THE PROJECT, *project name*
  2) *username* RENAMED THE PROJECT TO *project name*

  3) *username* ADDED *username* AS A CONTRIBUTOR/comrade
  4) *username* REMOVED *username* AS A CONTRIBUTOR/comrade

  5) *username* ADDED THE MILESTONE *milestone name* FOR DAY *day*
  6) *username* REMOVED THE MILESTONE *milestone name*

  7) *username* ADDED THE TASK *task name*
  8) *username* REMOVED THE TASK *task name*

  9) *username* ASSIGNED *username* TO TASK *task name*
  10) *username* REMOVED *username* FROM TASK *task name*

  11) *username* ADDED *task name* TO *milestone name*
  12) *username* REMOVED *task name* FROM *milestone name*

  13) *username* MARKED *task name* AS COMPLETED
  14) *username* MARKED *task name* AS BLOCKED

  15) MILESTONE *milestone name* WAS COMPLETED
  16) MILESTONE *milestone name* DEADLINE MISSED, *number* TASKS NOT COMPLETED
*/
  const vm = this;
  vm.test = 'Logs Yo';
  // vm.user = CurrentUserService.currentUser;
  $rootScope.$on('Log', (event, project, subject, params, object1, object2) => {
    if (object2) {
      if (params.model1 === 'user') {
        // *username* ASSIGNED *username* TO TASK *task name*
        // *username* REMOVED *username* FROM TASK *task name*
        vm.newLog = `${subject.username} ${params.action} ${object1.username} ${params.preposition} ${params.model2} ${object2.description}`;
        // console.log('New log: ', vm.newLog);
      } else if (params.model1 === 'task') {
        // *username* ADDED *task name* TO *milestone name*
        // *username* REMOVED *task name* FROM *milestone name*
        vm.newLog = `${subject.username} ${params.action} ${object1.description} ${params.preposition} ${params.model2} ${object2.title}`;
        // console.log('New log: ', vm.newLog);
      }
    } else {
      if (params.action === 'marked') {
        // *username* MARKED *task name* AS COMPLETED
        // *username* MARKED *task name* AS BLOCKED
        vm.newLog = `${subject.username} ${params.action} ${object1.description} ${params.preposition} ${params.condition}`;
        // console.log('New log: ', vm.newLog);
      } else if (params.model1 === 'user') {
        // *username* ADDED *username* AS A CONTRIBUTOR/comrade
        // *username* REMOVED *username* AS A CONTRIBUTOR/comrade
        vm.newLog = `${subject.username} ${params.action} ${object1.username} ${params.preposition} ${params.condition}`;
        // console.log('New log: ', vm.newLog);
      } else {
        // *username* CREATED THE PROJECT, *project name*
        // *username* RENAMED THE PROJECT TO *project name*
        // *username* ADDED THE MILESTONE *milestone name* FOR DAY *day*
        // *username* REMOVED THE MILESTONE *milestone name*
        // *username* ADDED THE TASK *task name*
        // *username* REMOVED THE TASK *task name*
        params.model1 === 'task' ? vm.object = object1.description : vm.object = object1.title;
        vm.newLog = `${subject.username} ${params.action} ${params.model1} ${vm.object}`;

      }
    }

    console.log('New log: ', vm.newLog);
    // createLog(vm.newLog);
  });


  // vm.createLog = createLog;
  // function createLog(obj, project, user) {
  //   vm.newLog = {};
  //   vm.newLog.user_id = user.id;
  //   vm.newLog.project_id = project.id;
  //   vm.newLog.content = `${user.username} `;
  //   console.log('Log out these things: ', obj, project, user);
  //   const logObj = {'log': vm.newLog };
  // }
}
