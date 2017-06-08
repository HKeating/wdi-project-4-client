angular
  .module('ProjectFour')
  .factory('Log', logFactory);

logFactory.$inject = ['API', '$resource'];
function logFactory(API, $resource) {
  return $resource(`${API}/logs/:id`, { id: '@_id' }, {
    'update': { method: 'PUT'}
  });
}
