var React = require('react');
var moment = require('moment');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      activeTime: ''
    };
  },
  mountTicker: function(timestamp) {
    this.setState({
      activeTime: moment(timestamp).fromNow()
    });

    this.tickerID = setInterval(function(){
      this.setState({
        activeTime: moment(timestamp).fromNow()
      });
    }.bind(this), 1000);
  },

  componentDidMount: function() {
    this.mountTicker(this.props.timestamp);
  },

  componentWillUnmount: function() {
    clearInterval(this.tickerID);
  },

  render: function() {
    return (
      <span>
        {` ${this.state.activeTime}.`}
      </span>
    );
  }
});
