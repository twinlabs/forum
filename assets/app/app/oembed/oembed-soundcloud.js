var $ = require('jquery');

module.exports = function embedSoundCloud(selector) {
  var $selector = $(selector);

  var SOUNDCLOUD = /https?:\/\/(www\.)?(m.)?soundcloud.com\/.+?/i;

  $selector.filter(function(index, element) {
    var match = false;

    if (this.getAttribute('href').match(SOUNDCLOUD) !== null) {
      match = true;
    }

    return match;
  }).each(function(index, element) {
    var requestUrl = element.getAttribute('href');

    $.ajax({
      url: 'https://soundcloud.com/oembed',
      dataType: 'jsonp',
      data: {
        url: requestUrl,
        format: 'js',
        maxheight: 166
      },
      success: function(data) {
        $(element).replaceWith(data.html);
      }
    });
  });
}

