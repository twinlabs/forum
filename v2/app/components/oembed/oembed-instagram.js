var $ = require('jquery');

module.exports = function embedInstagram(input, done) {
  const INSTAGRAM = /(.*)?(https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/p\/.*)(\s.*)?/i;

  const captured = INSTAGRAM.exec(input);

  if (!input || input.match(INSTAGRAM) === null) {
    return done(input);
  }

  return $.ajax({
    url: `//api.instagram.com/oembed?url=${encodeURIComponent(captured[2].replace('mobile.', ''))}&omitscript`,
    dataType: 'jsonp',
    success: function(data) {
      if (typeof captured[1] === 'undefined') {
        return done(input.replace(INSTAGRAM, data.html));
      }

      return done(input.replace(INSTAGRAM, captured[1] + data.html));
    }
  });
}

