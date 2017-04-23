module.exports = function embed(input) {
  const MATCH = /(?:https?:\/\/)open.spotify.com\/(.+)/;

  if (!input || input.match(MATCH) === null) {
    return Promise.resolve(input);
  }

  const [, matchID] = MATCH.exec(input);


  return Promise.resolve(input.replace(MATCH, `<iframe src="https://open.spotify.com/embed?uri=${resolveMatch(matchID)}" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>`));
}

function resolveMatch(input) {
  return `spotify:${input.replace(/\//g, ':')}`;
}
