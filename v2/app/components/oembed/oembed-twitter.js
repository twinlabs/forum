var $ = require('jquery');

module.exports = function embedTwitter(input, done) {
  const TWITTER = /(.*)(https?:\/\/(www\.)?(mobile\.)?twitter.com\/.+?\/status(es)?(.*))/ig;

  if (!input || input.match(TWITTER) === null) {
    return done(input);
  }

  const captured = TWITTER.exec(input);

  return $.ajax({
    url: `https://api.twitter.com/1/statuses/oembed.json?url=${encodeURIComponent(captured[2].replace('mobile.',''))}&omit_script`,
    dataType: 'jsonp',
    headers: {
      'Authorization': 'OAuth oauth_consumer_key="nujH4OgzdEtr9RcA55iOaYpzp", oauth_nonce="d953a64aad3116c9c6f66f78a2bc0aa6", oauth_signature="jZ5UPRi1Pz3xX1XfgMR6vUXfVLA%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1423944834", oauth_version="1.0"'
    },
    success: function(data) {
      if (typeof captured[2] === 'undefined') {
        return done(input.replace(TWITTER, data.html));
      }

      return done(input.replace(TWITTER, captured[1] + data.html));
    }
  });
}
