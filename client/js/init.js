(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('.parallax').parallax();
    $(".dropdown-trigger").dropdown({hover:true});
    $('#textarea1').val('');
    $('.modal').modal({dismissible:true});
    if(window.location.href.indexOf('#success') != -1) {
      $('#success').modal('open');
    }
    if(window.location.href.indexOf('#error') != -1) {
      $('#error').modal('open');
    }

  }); // end of document ready
})(jQuery); // end of jQuery name space
