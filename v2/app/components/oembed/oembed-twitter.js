var superagent = require('superagent');

module.exports = function embedTwitter(input) {
  const TWITTER = /(.*)(https?:\/\/(www\.)?(mobile\.)?twitter.com\/.+?\/status(es)?\/(.*))/ig;

  if (!input || input.match(TWITTER) === null) {
    return Promise.resolve(input);
  }

  const captured = TWITTER.exec(input);

  if (!captured[6]) {
    return Promise.resolve(input);
  }

  return superagent.get(
    `/embed/twitter/${encodeURIComponent(captured[2].replace('mobile.', ''))}`
  ).then(function(response) {
    if (typeof captured[2] === 'undefined') {
      return Promise.resolve(input.replace(TWITTER, response.body.html));
    }

    return Promise.resolve(input.replace(TWITTER, captured[1] + response.body.html));
  });
}
