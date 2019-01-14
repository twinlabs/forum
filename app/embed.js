var React = require('react');
var ReactDOM = require('react-dom');
var Root = require('./components/ThreadPost.jsx');

function renderHeadline(props) {
  if (props.depth > 1) {
    return null;
  }

  return (
    <span className="embedHeadline">
      <img
        src="/favicon.png"
        width="16"
        style={{
          marginRight: '1em',
          border: '1px solid hsla(0, 50%, 0%, 0.1)',
          verticalAlign: 'middle',
          borderRadius: '50%',
          display: 'inline-block',
          boxSizing: 'content-box',
          padding: '0.25em',
        }}
      />
      View Post
    </span>
  );
}
function render() {
  setTimeout(function() {
    if (window.postDepth < 2) {
      document.body.classList.add('embedBody--topLevel');
    }
  }, 1);

  ReactDOM.render(
    <a
      className="embedPermalink"
      href={`/post/${window.post.id}`}
      target="_top"
    >
      <link
        rel="stylesheet"
        href={`/stylesheets/v2-${window.localStorage.getItem(
          'forumStyleValue',
        )}.css`}
      />
      <Root
        className="post--embed"
        depth={window.postDepth || 1}
        contentRenderer={require('./components/markdownInitializer')}
        {...window.post}
      />
      {renderHeadline({ depth: window.postDepth })}
    </a>,
    document.getElementById('app'),
  );
}

render();
