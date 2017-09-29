var React = require('react');
var createReactClass = require('create-react-class');
var moment = require('moment');

module.exports = createReactClass({
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
    }.bind(this), 60000);
  },

  componentDidMount: function() {
    this.mountTicker(this.props.timestamp);
  },

  componentWillUnmount: function() {
    clearInterval(this.tickerID);
  },

  render: function() {
    return (
      <span title={moment(this.props.timestamp).format('MMMM Do YYYY, h:mm:ss a')}>
        {` ${this.state.activeTime}.`}
      </span>
    );
  }
});
