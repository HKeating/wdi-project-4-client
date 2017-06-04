angular
  .module('ProjectFour')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['CurrentUserService', '$rootScope', 'Project'];
function DashboardCtrl(CurrentUserService, $rootScope, Project) {
  const vm = this;
  vm.title = 'Dashboard page';
  vm.user = CurrentUserService.currentUser;
  if(!vm.user) {
    $rootScope.$on('loggedIn', () => {
      vm.user = CurrentUserService.currentUser;
      vm.projects = vm.user.projects;
    });
  }
  $rootScope.$on('New Project', () => {
    CurrentUserService.getUser();
  });

  vm.createProject = createProject;

  function createProject() {
    vm.newProject.user_id = vm.user.id;
    Project
      .save(vm.newProject)
      .$promise
      .then((data) => {
        console.log('New project created: ', data);
        $rootScope.$broadcast('New Project');
      });
  }

}
