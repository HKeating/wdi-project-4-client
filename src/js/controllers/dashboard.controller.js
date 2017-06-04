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
  // $rootScope is like a global event listener/trigger across the whole app.
  // You use $rootScope.$broadcast('Your Message'); as the trigger
  // and $rootScope.$on('Your Message', () => { Triggered function }); as the listener.
  $rootScope.$on('Project Change', () => {
    CurrentUserService.getUser();
    vm.newProject = {};
    vm.projectToUpdate = {};
  });

  vm.createProject = createProject;
  function createProject() {
    vm.newProject.user_id = vm.user.id;
    Project
      .save(vm.newProject)
      .$promise
      .then((data) => {
        console.log('New project created: ', data);
        $rootScope.$broadcast('Project Change');
      });
  }

  vm.deleteProject = deleteProject;
  function deleteProject(project) {
    Project
    .delete({ id: project.id })
    .$promise
    .then(() => {
      $rootScope.$broadcast('Project Change');
    });
  }

  vm.showEditForm = false;
  vm.selectToEdit = selectToEdit;
  function selectToEdit(projectId) {
    vm.showEditForm = true;
    vm.projectToUpdate = Project.get({id: projectId});
  }

  vm.hideEditForm = hideEditForm;
  function hideEditForm() {
    vm.showEditForm = false;
    vm.projectToUpdate = {};
  }


  vm.updateProject = updateProject;
  function updateProject(project) {
    // if (vm.editForm.$valid) {
    Project
      .update({id: project.id }, project)
      .$promise
      .then(() => {
        $rootScope.$broadcast('Project Change');
        vm.showEditForm = false;
      });
    // }
  }

}
