module.exports = function embedYouTube(input) {
  const YOUTUBE = /(?:https?:\/\/)?(?:m\.)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

  var matches = input && input.match(new RegExp(YOUTUBE, 'g'));
  var matchID;
  var responseBody = '';

  if (!matches) {
    return Promise.resolve(input);
  }

  for (var i = 0; i<matches.length; i++) {
    matchID = matches[i].match(YOUTUBE)[1];

    if (!responseBody) {
      responseBody = responseBody + input.replace(matches[i], `<iframe style="min-height: 350px" src="//www.youtube.com/embed/${matchID}" frameborder="0" allowfullscreen></iframe>`);
    } else {
      responseBody = responseBody.replace(matches[i], `<iframe style="min-height: 350px" src="//www.youtube.com/embed/${matchID}" frameborder="0" allowfullscreen></iframe>`);
    }

    if (i === matches.length - 1) {
      return Promise.resolve(responseBody);
    }
  }
}
