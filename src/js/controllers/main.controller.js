angular
.module('ProjectFour')
.controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', 'CurrentUserService', '$state', '$scope'];
function MainCtrl($rootScope, CurrentUserService, $state, $scope) {
  const vm = this;

  vm.test = 'Hello';

  CurrentUserService.getUser();



  $rootScope.$on('loggedIn', () => {
    vm.user = CurrentUserService.currentUser;
  });
  vm.logout = () => {
    CurrentUserService.removeUser();
  };
  $rootScope.$on('loggedOut', () => {
    vm.user = null;
    $state.go('home');
  });

  vm.goToUserProfile = () => {
    $state.go('profile');
  };

  $scope.$state = $state;

  //var container = document.getElementById('container');

  // var square1 = document.getElementById('square1');
  // var movingShip = document.getElementById('movingShip');


  // $scope.$square1 = $('#square1');
  // $scope.$movingShip = $('#movingShip');

  // $scope.$square1 = $('#square1');
  // $scope.$movingShip = $('#movingShip');
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var scrollArea = 0 - windowHeight;
  //
  // console.log('SQUARE 2!!!!!', movingShip);

  // update position of square 1 and square 2 when scroll event fires.

  window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset || window.scrollTop;
    var scrollPercent = scrollTop/scrollArea || 0;
    console.log(movingShip.style.left);

    // square1.style.left = scrollPercent * windowWidth + 'px';
    movingShip.style.left = 0 - scrollPercent*windowWidth * 0.35 + 'px';

    // if (parseInt(movingShip.style.left) > 870) {
    //   movingShip.style = 150 - scrollPercent*windowWidth;
    // }

  });

  $('input[type="submit"]').mousedown(function(){
    $(this).css('background', '#2ecc71');
  });
  $('input[type="submit"]').mouseup(function(){
    $(this).css('background', '#1abc9c');
  });

  $('#loginform').click(function(){
    $('.login').fadeToggle('slow');
    $(this).toggleClass('green');
  });








  // Add smooth scrolling to all links
  $('a').on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== '') {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 1000, function(){
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });



  $(document).mouseup(function (e){
    var container = $('.login');

    if (!container.is(e.target) // if the target of the click isn't the container...
    && container.has(e.target).length === 0){
      container.hide();
      $('#loginform').removeClass('green');
    }
  });


}
