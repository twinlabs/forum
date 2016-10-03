module.exports = function embedVine(input, done) {
  const VINE = /(?:https?:\/\/)vine.co\/v\/(.+)/;

  if (!input || input.match(VINE) === null) {
    return done(input);
  }

  const captured = VINE.exec(input);

  const matchID = captured[1];

  return done(input.replace(VINE, `<iframe src="//www.vine.co/v/${matchID}/embed/simple" width="600" height="600" frameborder="0"></iframe><script src="//platform.vine.co/static/scripts/embed.js"></script>`));
}

