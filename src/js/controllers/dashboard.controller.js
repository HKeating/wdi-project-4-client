angular
.module('ProjectFour')
.controller('DashboardCtrl', DashboardCtrl);

DashboardCtrl.$inject = ['CurrentUserService', '$rootScope', 'Project', 'User'];
function DashboardCtrl(CurrentUserService, $rootScope, Project, User) {
  const vm = this;
  vm.title = 'Dashboard page';
  vm.user = CurrentUserService.currentUser;
  vm.newProject = {};
  vm.newProject.user_ids = [];
  vm.collabProjects = [];
  CurrentUserService.getUser();
// getProjects();
  // When loggedIn fires refresh currentUser - allows live updating of projects
  $rootScope.$on('loggedIn', () => {
    // vm.user = CurrentUserService.currentUser;
    // vm.projects = vm.user.projects;
    // vm.collabProjects = [];
    // Project.query()
    // .$promise
    // .then(data => {
    //   data.map(project => {
    //     if ((!vm.projects.find(x => x.id === project.id)) && (project.users.find(x => x.id === vm.user.id))) {
    //       vm.collabProjects.push(project);
    //     }
    //
    //   });
    // });
    getProjects();
  });


  function getProjects() {
    vm.user = CurrentUserService.currentUser;
    vm.projects = vm.user.projects;

    Project.query()
    .$promise
    .then(data => {
      data.map(project => {
        if ((!vm.collabProjects.find(x => x.id === project.id)) && (!vm.projects.find(x => x.id === project.id)) && (project.users.find(x => x.id === vm.user.id))) {
          vm.collabProjects.push(project);
        }

      });
    });
  }

  // $rootScope is like a global event listener/trigger across the whole app.
  // You use $rootScope.$broadcast('Your Message'); as the trigger
  // and $rootScope.$on('Your Message', () => { Triggered function }); as the listener.
  $rootScope.$on('Project Change', () => {
    // On project change (CRUD) refresh current user, clear newProject and projectToUpdate objects
    vm.projects = [];
    CurrentUserService.getUser();
    vm.newProject = {};
    vm.projectToUpdate = {};
    vm.newProject = {};
    vm.newProject.user_ids = [];
    $('.lookupField').val('');
  });

  vm.createProject = createProject;
  function createProject() {
    vm.newProject.user_id = vm.user.id;
    // vm.newProject.user_ids = [];
    vm.newProject.user_ids.push(vm.user.id);
    vm.newProject.start_date = new Date;
    // console.log('Duration: ', vm.newProject.duration);
    const endDate = addDays(vm.newProject.start_date, parseInt(vm.newProject.duration));
    vm.newProject.end_date = endDate;
    if (!vm.newProject.image) vm.newProject.image = 'http://www.fillmurray.com/180/180';
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

  vm.addCollaborator = addCollaborator;
  function addCollaborator() {
    User.query()
    .$promise
    .then(data => {
      data.map(user => {
        user.email === vm.userLookup && !vm.newProject.user_ids.includes(user.id) && user.id !== vm.user.id ? vm.newProject.user_ids.push(user.id) : console.log('No user matching that email');
      });
      findCollaborators(vm.newProject);
    });
    $('.lookupField').val('');
  }

  function findCollaborators(project) {
    User.query()
    .$promise
    .then(data => {
      project.collaborators = [];
      data.map(user => {
        project.user_ids.includes(user.id) ? project.collaborators.push(user) : console.log('User not a collaborator');
      });
    });
  }

  vm.removeCollaborator = removeCollaborator;
  function removeCollaborator(id, project) {
    console.log('Project: ', project);
    console.log('User id: ', id);
    project.user_ids.splice(project.user_ids.indexOf(id), 1);
    findCollaborators(project);
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

  vm.daysLeft = daysLeft;
  function daysLeft(date) {
    if(date) {
      const oneDay = 24*60*60*1000;
      const currentDate = new Date;
      const endDate = new Date(date);
      return Math.round(Math.abs((currentDate.getTime() - endDate.getTime())/(oneDay)));
    } else {
      return 'Invalid date format';
    }

  }

}


// Additional properties to add to project:
// New date for project start
// Select users (post mvp set up requests)
//
