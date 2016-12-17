var React = require('react');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="loader">
        <span className="loader-text">
          <span className="accent">
            {'{'}
          </span>
          Loading...
          <span className="accent">
            {'}'}
          </span>
        </span>
      </div>
    );
  }
});
