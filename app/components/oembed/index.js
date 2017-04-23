module.exports = function(input) {

  // this is just a series of transforms,
  // they can happen in any order:

  return require('./oembed-instagram')(input)
    .then(require('./oembed-spotify'))
    .then(require('./oembed-soundcloud'))
    .then(require('./oembed-twitter'))
    .then(require('./oembed-vine'))
    .then(require('./oembed-youtube'));
};
