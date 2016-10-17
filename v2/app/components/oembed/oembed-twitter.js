var superagent = require('superagent');

module.exports = function embedTwitter(input, done) {
  const TWITTER = /(.*)(https?:\/\/(www\.)?(mobile\.)?twitter.com\/.+?\/status(es)?\/(.*))/ig;

  if (!input || input.match(TWITTER) === null) {
    return done(input);
  }

  const captured = TWITTER.exec(input);

  if (!captured[6]) {
    return done(input);
  }

  return superagent.get(
    `/embed/twitter/${encodeURIComponent(captured[2].replace('mobile.', ''))}`
  ).then(function(response) {
    if (typeof captured[2] === 'undefined') {
      return done(input.replace(TWITTER, response.body.html));
    }

    return done(input.replace(TWITTER, captured[1] + response.body.html));
  });
}
