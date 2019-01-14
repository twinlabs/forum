module.exports = function embed(input) {
  const MATCH = /(?:https?:\/\/).*(itun\.es|itunes\.apple\.com)\/.*(.*i=([0-9]+)|playlist\/.*idpl\.([a-zA-Z0-9]+)).*/;

  if (!input || input.match(MATCH) === null) {
    return Promise.resolve(input);
  }

  let [, , , matchID] = MATCH.exec(input);

  if (!matchID) {
    matchID = MATCH.exec(input)[4];
  }

  if (input.match('/playlist/')) {
    return Promise.resolve(
      input.replace(
        MATCH,
        `<iframe src="https://tools.applemusic.com/embed/v1/playlist/pl.${matchID}" width="100%" height="500" frameborder="0" allowtransparency="true"></iframe>`,
      ),
    );
  }

  return Promise.resolve(
    input.replace(
      MATCH,
      `<iframe src="https://tools.applemusic.com/embed/v1/song/${matchID}" width="100%" height="110" frameborder="0" allowtransparency="true"></iframe>`,
    ),
  );
};
