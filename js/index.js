$(document).ready(function() {
  var editor = new Scribe('#editor', {
    modules: {
      toolbar: { container: '#toolbar' }
    },
    theme: 'snow'
  });

  $('.scribe-wrapper').tooltip({ trigger: 'manual' });
  var tooltipTimer = setTimeout(function() {
    $('.scribe-wrapper').tooltip('show');
  }, 2500);

  editor.on('focus-change', function(hasFocus) {
    $('#editor').toggleClass('focus', hasFocus);
    $('.scribe-wrapper').tooltip('destroy');
    clearTimeout(tooltipTimer);
  });
});
