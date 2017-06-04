angular
  .module('ProjectFour')
  .factory('Project', projectFactory);

projectFactory.$inject = ['API', '$resource'];
function projectFactory(API, $resource) {
  return $resource(`${API}/projects/:id`, { id: '@_id' }, {
    'update': { method: 'PUT'}
  });
}
