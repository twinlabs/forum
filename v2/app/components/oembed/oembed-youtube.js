module.exports = function embedYouTube(input, done) {
  const YOUTUBE = /(?:https?:\/\/)?(?:m\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;

  if (!input || input.match(YOUTUBE) === null) {
    return done(input);
  }

  const captured = YOUTUBE.exec(input);

  const matchID = captured[1];

  return done(input.replace(YOUTUBE, `<iframe style="min-height: 350px" src="//www.youtube.com/embed/${matchID}" frameborder="0" allowfullscreen></iframe>`));
}
