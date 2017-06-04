angular
  .module('ProjectFour')
  .controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['CurrentUserService', '$rootScope', 'Project', '$scope'];
function DashboardCtrl(CurrentUserService, $rootScope, Project, $scope) {
  const vm = this;
  vm.title = 'Dashboard page';
  vm.user = CurrentUserService.currentUser;
  if(!vm.user) {
    $rootScope.$on('loggedIn', () => {
      vm.user = CurrentUserService.currentUser;
      vm.projects = vm.user.projects;
      console.log(vm.projects);
    });
  }
  $rootScope.$on('Project Change', () => {
    CurrentUserService.getUser();
  });
  $scope.$projectForm = $('#projectForm');
  vm.createProject = createProject;
  function createProject() {
    vm.newProject.user_id = vm.user.id;
    Project
      .save(vm.newProject)
      .$promise
      .then((data) => {
        console.log('New project created: ', data);
        $rootScope.$broadcast('Project Change');
        $scope.$projectForm.setPristine();
        $scope.$projectForm.setUntouched();
      });
  }

  vm.deleteProject = deleteProject;
  function deleteProject(project) {
    Project
    .delete({ id: project.id })
    .$promise
    .then(() => {
      console.log('Project deleted');
      $rootScope.$broadcast('Project Change');
    });
  }

}
