var React = require('react');

var createReactClass = require('create-react-class');

module.exports = createReactClass({
  render: function() {
    return (
      <div className="loader">
        <span className="loader-text">
          <span className="accent">{'{'}</span>
          Loading...
          <span className="accent">{'}'}</span>
        </span>
      </div>
    );
  },
});
