angular
  .module('ProjectFour')
  .factory('Milestone', milestoneFactory);

milestoneFactory.$inject = ['API', '$resource'];
function milestoneFactory(API, $resource) {
  return $resource(`${API}/milestones/:id`, { id: '@_id' }, {
    'update': { method: 'PUT'}
  });
}
