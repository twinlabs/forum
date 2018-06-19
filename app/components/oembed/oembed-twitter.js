var superagent = require('superagent');
var Promise = require('bluebird');

module.exports = function embedTwitter(input) {
  const TWITTER = /https?:\/\/(www\.)?(mobile\.)?twitter.com\/.+?\/status(es)?\/\d+(\?.[^\s]*)?/ig;

  var matches = input && input.match(TWITTER);
  var responseBody = '';
  var responsePromiseStack = [];

  if (!matches) {
    return Promise.resolve(input);
  }

  for (var i = 0; i<matches.length; i++) {
    responsePromiseStack.push(superagent.get(
      `/embed/twitter/${encodeURIComponent(matches[i].replace('mobile.', ''))}`
    ));
  }

  return Promise.all(responsePromiseStack).then(function(responses) {
    for (var i = 0; i<matches.length; i++) {
      if (!responseBody) {
        responseBody = responseBody + input.replace(matches[i], responses[i].body.html);
      } else {
        responseBody = responseBody.replace(matches[i], responses[i].body.html);
      }

      if (i === matches.length - 1) {
        return responseBody;
      }
    }
  });
}
