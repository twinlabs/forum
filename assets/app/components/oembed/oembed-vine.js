var $ = require('jquery');

module.exports = function embedVine(selector) {
  var $selector = $(selector);

  var VINE = /(?:https?:\/\/)vine.co\/v\/(.+)/;

  $selector.filter(function(index, element) {
    var match = false;

    if (this.getAttribute('href').match(VINE) !== null) {
      match = true;
    }

    return match;
  }).each(function(index, element) {
    var matchID = element.getAttribute('href').match(VINE)[1];

    $(element).replaceWith('<iframe src="https://www.vine.co/v/'  + matchID + '/embed/simple"' +  ' width="600" height="600" frameborder="0"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script>');
  });
}

