var React = require('react');
var ReactDOM = require('react-dom');
var Preify = require('./Preify.jsx');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="post">
        <Preify>
          {JSON.stringify(this.props)}
        </Preify>
      </div>
    )
  }
});
