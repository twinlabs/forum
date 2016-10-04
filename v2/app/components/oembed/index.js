module.exports = function(input, callback) {
  // now that we have this mechanism, it's clear
  // that it's easy to clobber changes as they pass through
  // any of these steps. we might want to:
  // a. think of this as a series of transforms and
  //    pass everything through in series.
  // b. not entirely sure what B is yet, but there's always a B.

  require('./oembed-instagram')(input, callback);
  require('./oembed-soundcloud')(input, callback);
  require('./oembed-twitter')(input, callback);
  require('./oembed-vine')(input, callback);
  require('./oembed-youtube')(input, callback);
};
