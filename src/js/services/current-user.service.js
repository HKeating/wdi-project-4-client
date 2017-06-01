angular
  .module('ProjectFour')
  .service('CurrentUserService', CurrentUserService);

CurrentUserService.$inject = ['TokenService', '$rootScope', 'User'];
function CurrentUserService(TokenService, $rootScope, User) {
  const self = this;

  self.getUser = () => {
    const decoded = TokenService.decodeToken();
    console.log('Get User is firing');
    if (decoded) {
      User
        .get({ id: decoded.id })
        .$promise
        .then(data => {
          self.currentUser = data;
          $rootScope.$broadcast('loggedIn');
        });
    }
  };
  self.removeUser = () => {
    self.currentUser = null;
    TokenService.removeToken();
    $rootScope.$broadcast('loggedOut');
  };
}
