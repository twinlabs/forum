module.exports = function embed(input) {
  const MATCH = /(?:https?:\/\/)(itun.es|geo.itunes.apple.com)\/.*i=([0-9]+).*/;

  if (!input || input.match(MATCH) === null) {
    return Promise.resolve(input);
  }

  const [, , matchID] = MATCH.exec(input);

  return Promise.resolve(input.replace(MATCH, `<iframe src="https://tools.applemusic.com/embed/v1/song/${matchID}" width="100%" height="110" frameborder="0" allowtransparency="true"></iframe>`));
}
