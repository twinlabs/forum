var $ = require('jquery');

module.exports = function embedSoundCloud(input, done) {
  const SOUNDCLOUD = /(.*)?(https?:\/\/(www\.)?(m.)?soundcloud.com\/[^\s]+)(\s*.*)?/i

  if (!input || input.match(SOUNDCLOUD) === null) {
    return done(input);
  }

  const captured = SOUNDCLOUD.exec(input);

  return $.ajax({
    url: '//soundcloud.com/oembed',
    dataType: 'jsonp',
    data: {
      url: captured[2],
      format: 'js',
      maxheight: 166
    },
    success: function(data) {
      if (typeof captured[1] === 'undefined') {
        return done(input.replace(SOUNDCLOUD, data.html));
      }

      return done(input.replace(SOUNDCLOUD, captured[1] + data.html));
    }
  });
}

