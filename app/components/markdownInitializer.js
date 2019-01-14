var marked = require('marked');

module.exports = (function() {
  var markedRenderer = new marked.Renderer();
  markedRenderer.link = function(href, title, text) {
    return `
      <a
        target="_blank"
        href="${href}"
        ${title ? 'title="' + title + '"' : ''}
      >
        ${text}
      </a>`;
  };

  if (window.localStorage.getItem('forumDisableImages') === 'true') {
    markedRenderer.image = function(href, title, text) {
      return `
        <a
          target="_blank"
          href="${href}"
          ${title ? 'title="' + title + '"' : ''}
        >
          ${href}
        </a>
      `;
    };
  }

  var lexer = new marked.Lexer();
  lexer.rules.heading = { exec: function() {} };

  marked.lexer = lexer;

  marked.setOptions({
    emoji: function(emoji) {
      return (
        '<img src="' +
        'https://cloud.ahfr.org/images/emoji/' +
        encodeURIComponent(emoji) +
        '.png"' +
        ' alt=":' +
        escape(emoji) +
        ':"' +
        ' title=":' +
        escape(emoji) +
        ':"' +
        ' class="emoji" align="absmiddle" height="20" width="20">'
      );
    },
    breaks: true,
    renderer: markedRenderer,
  });

  return marked;
})();
