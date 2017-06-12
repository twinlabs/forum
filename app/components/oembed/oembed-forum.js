module.exports = function embedForum(input, depth) {
  depth = parseInt(depth, 10);

  let host = window.location.host;

  const MATCH = new RegExp(`https?:\/\/${host}\/post\/(\\d+)`, 'ig');

  var matches = input && input.match(MATCH);
  var matchID;
  var responseBody = '';

  if (!matches) {
    return Promise.resolve(input);
  }

  for (var i = 0; i<matches.length; i++) {
    matchID = matches[i].match(new RegExp(`https?:\/\/${host}\/post\/(\\d+)`, 'i'))[1]

    if (!responseBody) {
      responseBody = responseBody + input.replace(matches[i], renderFrame(host, matchID, depth));
    } else {
      responseBody = responseBody.replace(matches[i], renderFrame(host, matchID, depth));
    }

    if (i === matches.length - 1) {
      return Promise.resolve(responseBody);
    }
  }
}

function renderFrame(host, id, depth) {
  return `
  <iframe
    src="//${host}/embed/v1/post/${id}#depth=${depth}"
    class="blockquote embedFrame"
    data-depth="${depth}"
    width="100%"
    frameborder="0"
    allowtransparency="true"
  ></iframe>
  `
}
