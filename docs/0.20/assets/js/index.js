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

  // Bootstrap Toolbar has positioning but when showing manually when tooltip is offscreen
  $('.quill-wrapper').tooltip({ trigger: 'manual', animation: false }).tooltip('show');
  $('.quill-wrapper + .tooltip').hide();
  var tooltipTimer = setTimeout(function() {
    $('.quill-wrapper + .tooltip').fadeIn(1000);
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

  var users = {
    'Asana': 'https://asana.com/',
    'Front': 'https://frontapp.com/',
    'Intuit': 'https://www.intuit.com/',
    'Lever': 'https://www.lever.co/',
    'MerchantCircle': 'https://www.merchantcircle.com/',
    'Reedsy': 'https://reedsy.com/',
    'RelateIQ': 'https://www.relateiq.com/',
    'Respondly': 'https://respond.ly/',
    'Salesforce': 'https://www.salesforce.com/',
    'ThemeXpert': 'https://www.themexpert.com/',
    'Vox Media': 'https://www.voxmedia.com/',
    'Writer': 'https://chrome.google.com/webstore/detail/writer/hlddiopdeghmcmdjjmpdegemnojihpib?hl=en'
  };

  var keys = Object.keys(users);
  // Show users randomly
  $('#users-container a').each(function(i, link) {
    var index = Math.floor(Math.random() * keys.length);
    var key = keys[index];
    keys.splice(index, 1);
    $(link).attr({ href: users[key], title: key });
    $('img', link).attr({
      src: '/0.20/assets/images/users/' + (key.toLowerCase().replace(/\s/g, '')) + '.png',
      alt: key
    });
  });

  console.log("Welcome to Quill!\n\nThe editor on this page is available via `quill`. Give the API a try:\n\n\tquill.formatText(6, 10, 'bold', true);\n\nVisit the API documenation page to learn more: https://quilljs.com/docs/api/\n");
});
