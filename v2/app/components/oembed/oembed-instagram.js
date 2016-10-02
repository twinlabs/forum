var $ = require('jquery');

module.exports = function embedInstagram(selector) {
  var $selector = $(selector);

  var INSTAGRAM = /https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/p\/.*/i;

  $selector.filter(function(index, element) {
    var match = false;

    if (this.getAttribute('href').match(INSTAGRAM) !== null) {
      match = true;
    }

    if ($(this).closest('.instagram-media').length) {
      match = false;
    }

    return match;
  }).each(function(index, element) {
    var requestUrl = element.getAttribute('href');

    requestUrl = requestUrl.replace('mobile.', '');

    $.ajax({
      url: 'https://api.instagram.com/oembed?url=' + encodeURIComponent(requestUrl),
      dataType: 'jsonp',
      success: function(data) {
        $(element).replaceWith(data.html);
      }
    });
  });
}

