var quill;   // Expose as global so people can easily try out the API

$(document).ready(function() {
  quill = new Quill('#editor', {
    modules: {
      'toolbar': { container: '#toolbar' },
      'image-tooltip': true,
      'link-tooltip': true
    },
    theme: 'snow'
  });

  $('.quill-wrapper').tooltip({ trigger: 'manual' });
  var tooltipTimer = setTimeout(function() {
    $('.quill-wrapper').tooltip('show');
  }, 2500);

  quill.once('selection-change', function(hasFocus) {
    $('#editor').toggleClass('focus', hasFocus);
    // Hack for inability to scroll on mobile
    if (/mobile/i.test(navigator.userAgent)) {
      $('#editor').css('height', quill.root.scrollHeight + 30)   // 30 for padding
    }
    $('.quill-wrapper').tooltip('destroy');
    clearTimeout(tooltipTimer);
  });
});
