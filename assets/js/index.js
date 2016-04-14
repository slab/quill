$(document).ready(function() {
  // Expose as global so people can easily try out the API
  var quill = window.quill = new Quill('#editor', {
    modules: {
      'code-highlighter': true,
      'toolbar': '#toolbar'
    },
    theme: 'snow'
  });

  quill.once('selection-change', function(hasFocus) {
    $('#editor').toggleClass('focus', hasFocus);
    // Hack for inability to scroll on mobile
    if (/mobile/i.test(navigator.userAgent)) {
      $('#editor').css('height', quill.root.scrollHeight + 30)   // 30 for padding
    }
  });

  var users = {
    'Asana': 'https://asana.com/',
    'Front': 'https://frontapp.com/',
    'Intuit': 'https://www.intuit.com/',
    'Lever': 'https://www.lever.co/',
    'MerchantCircle': 'http://www.merchantcircle.com/',
    'Reedsy': 'https://reedsy.com/',
    'RelateIQ': 'https://www.relateiq.com/',
    'Respondly': 'https://respond.ly/',
    'Salesforce': 'http://www.salesforce.com/',
    'ThemeXpert': 'https://www.themexpert.com/',
    'Vox Media': 'http://www.voxmedia.com/',
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
      src: '/assets/images/users/' + (key.toLowerCase().replace(/\s/g, '')) + '.png',
      alt: key
    });
  });

  console.log("Welcome to Quill!\n\nThe editor on this page is available via `quill`. Give the API a try:\n\n\tquill.formatText(11, 4, 'bold', true);\n\nVisit the API documenation page to learn more: http://quilljs.com/docs/api/\n");
});
