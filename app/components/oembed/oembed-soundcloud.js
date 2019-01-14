var superagent = require('superagent');

module.exports = function embedSoundCloud(input) {
  const SOUNDCLOUD = /(.*)?(https?:\/\/(www\.)?(m.)?soundcloud.com\/[^\s]+)(\s*.*)?/i;

  if (!input || input.match(SOUNDCLOUD) === null) {
    return Promise.resolve(input);
  }

  const captured = SOUNDCLOUD.exec(input);

  return superagent
    .get(`/embed/soundcloud/${encodeURIComponent(captured[2])}`)
    .then(function(response) {
      if (typeof captured[1] === 'undefined') {
        return Promise.resolve(input.replace(SOUNDCLOUD, response.body.html));
      }

      return Promise.resolve(
        input.replace(SOUNDCLOUD, captured[1] + response.body.html),
      );
    });
};
