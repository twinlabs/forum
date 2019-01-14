var superagent = require('superagent');

module.exports = function embedInstagram(input) {
  const INSTAGRAM = /(.*)?(https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/p\/.*)(\s.*)?/i;

  const captured = INSTAGRAM.exec(input);

  if (!input || input.match(INSTAGRAM) === null) {
    return Promise.resolve(input);
  }

  return superagent
    .get(
      `/embed/instagram/${encodeURIComponent(
        captured[2].replace('mobile.', ''),
      )}`,
    )
    .then(function(response) {
      if (typeof captured[1] === 'undefined') {
        return Promise.resolve(input.replace(INSTAGRAM, response.body.html));
      }

      return Promise.resolve(
        input.replace(INSTAGRAM, captured[1] + response.body.html),
      );
    });
};
