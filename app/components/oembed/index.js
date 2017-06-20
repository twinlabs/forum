module.exports = function(input, depth) {

  // this is just a series of transforms,
  // they can happen in any order:

  return require('./oembed-instagram')(input)
    .then(require('./oembed-spotify'))
    .then(require('./oembed-applemusic'))
    .then(require('./oembed-soundcloud'))
    .then(require('./oembed-twitter'))
    .then(require('./oembed-vine'))
    .then(require('./oembed-youtube'))
    .then(handleEmbedTransform(depth))
};

function handleEmbedTransform(depth) {
  depth = depth || 1;

  return function(input) {
    if (depth > 5) {
      return Promise.resolve(input);
    }

    return require('./oembed-forum')(input, depth);
  };
}
