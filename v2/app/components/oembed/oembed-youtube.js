module.exports = function embedYouTube(input) {
  const YOUTUBE = /(?:https?:\/\/)?(?:m\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;

  if (!input || input.match(YOUTUBE) === null) {
    return Promise.resolve(input);
  }

  const captured = YOUTUBE.exec(input);

  const matchID = captured[1];

  return Promise.resolve(input.replace(YOUTUBE, `<iframe style="min-height: 350px" src="//www.youtube.com/embed/${matchID}" frameborder="0" allowfullscreen></iframe>`));
}
