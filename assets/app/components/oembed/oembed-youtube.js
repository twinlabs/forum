var $ = require('jquery');

module.exports = function embedYouTube(selector) {
  var $selector = $(selector);

  var YOUTUBE = /(?:https?:\/\/)?(?:m\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;

  $selector.filter(function(index, element) {
    var match = false;

    if (this.getAttribute('href').match(YOUTUBE) !== null) {
      match = true;
    }

    return match;
  }).each(function(index, element) {

    var matchID = element.getAttribute('href').match(YOUTUBE)[1];
    $(element).replaceWith('<iframe style="min-height: 350px" src="https://www.youtube.com/embed/'  + matchID + '"' +  ' frameborder="0" allowfullscreen></iframe>');
  });
}
