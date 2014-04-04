$(document).ready(function() {
  var editor = new Quill('#editor', {
    modules: {
      toolbar: { container: '#toolbar' }
    },
    theme: 'snow'
  });

  $('.quill-wrapper').tooltip({ trigger: 'manual' });
  var tooltipTimer = setTimeout(function() {
    $('.quill-wrapper').tooltip('show');
  }, 2500);

  editor.once('focus-change', function(hasFocus) {
    $('#editor').toggleClass('focus', hasFocus);
    $('.quill-wrapper').tooltip('destroy');
    clearTimeout(tooltipTimer);
  });
});
