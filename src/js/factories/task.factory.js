angular
  .module('ProjectFour')
  .factory('Task', taskFactory);

taskFactory.$inject = ['API', '$resource'];
function taskFactory(API, $resource) {
  return $resource(`${API}/tasks/:id`, { id: '@_id' }, {
    'update': { method: 'PUT'}
  });
}
