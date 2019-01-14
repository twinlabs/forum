module.exports = function embedVine(input) {
  const VINE = /(?:https?:\/\/)vine.co\/v\/(.+)/;

  if (!input || input.match(VINE) === null) {
    return Promise.resolve(input);
  }

  const captured = VINE.exec(input);

  const matchID = captured[1];

  return Promise.resolve(
    input.replace(
      VINE,
      `<iframe src="//www.vine.co/v/${matchID}/embed/simple" width="600" height="600" frameborder="0"></iframe><script src="//platform.vine.co/static/scripts/embed.js"></script>`,
    ),
  );
};
