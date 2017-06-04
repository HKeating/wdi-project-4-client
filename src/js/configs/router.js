angular
  .module('ProjectFour')
  .config(Router);

Router.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];
function Router($stateProvider, $locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);


  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: '/js/views/home.html'
  })
  .state('register', {
    url: '/register',
    templateUrl: '/js/views/register.html',
    controller: 'RegisterCtrl',
    controllerAs: 'register'
  })
  .state('login', {
    url: '/login',
    templateUrl: '/js/views/login.html',
    controller: 'LoginCtrl',
    controllerAs: 'login'
  })
  .state('usersIndex', {
    url: '/users',
    templateUrl: '/js/views/users/index.html',
    controller: 'UsersIndexCtrl',
    controllerAs: 'users'
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: '/js/views/dashboard.html',
    controller: 'DashboardCtrl',
    controllerAs: 'dashboard'
  })
  .state('project', {
    url: '/project/:id',
    templateUrl: '/js/views/project.html',
    controller: 'ProjectCtrl',
    controllerAs: 'project'
  });

  $urlRouterProvider.otherwise('/');
}
