angular
.module('ProjectFour')
.controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['CurrentUserService', '$rootScope', 'Project'];
function DashboardCtrl(CurrentUserService, $rootScope, Project) {
  const vm = this;
  vm.title = 'Dashboard page';
  vm.user = CurrentUserService.currentUser;


  // When loggedIn fires refresh currentUser - allows live updating of projects
  $rootScope.$on('loggedIn', () => {
    vm.user = CurrentUserService.currentUser;
    vm.projects = vm.user.projects;
  });

  // $rootScope is like a global event listener/trigger across the whole app.
  // You use $rootScope.$broadcast('Your Message'); as the trigger
  // and $rootScope.$on('Your Message', () => { Triggered function }); as the listener.
  $rootScope.$on('Project Change', () => {
    // On project change (CRUD) refresh current user, clear newProject and projectToUpdate objects
    CurrentUserService.getUser();
    vm.newProject = {};
    vm.projectToUpdate = {};
  });

  vm.createProject = createProject;
  function createProject() {
    vm.newProject.user_id = vm.user.id;
    vm.newProject.user_ids = [];
    vm.newProject.user_ids.push(vm.user.id);
    vm.newProject.start_date = new Date;
    // console.log('Duration: ', vm.newProject.duration);
    const endDate = addDays(vm.newProject.start_date, parseInt(vm.newProject.duration));
    vm.newProject.end_date = endDate;
    const projectObj = {
      'project': vm.newProject
    };
    console.log('Sending project: ', projectObj);
    Project
    .save(projectObj)
    .$promise
    .then((data) => {
      console.log('New project created: ', data);
      $rootScope.$broadcast('Project Change');
    });
  }

  function addDays(date, days) {
    console.log('Date: ', date);
    console.log('Days: ', days);
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
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
    // Use id of project where edit button was clicked to find that project in db
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


// Additional properties to add to project:
// New date for project start
// Select users (post mvp set up requests)
//
