var React = require('react');
var browserHistory = require('react-router').browserHistory;
var superagent = require('superagent');
var _ = require('lodash/core');

var ControlBar = require('./ControlBar.jsx');

var Root = React.createClass({
  handleRootNavigation: function(event) {
    event.preventDefault();

    browserHistory.push('/v2');
  },

  handleRootRefresh: function(event) {
    event.preventDefault();

    document.body.classList.add('is-loading');
    superagent.get(`/topics`)
      .set('Accept', 'application/json')
        .then(function(response){
          window.store.dispatch({
            type: 'REINITIALIZE',
            value: response.body
          });
          document.body.classList.remove('is-loading');
        }.bind(this), function(error){
         throw new Error(error);
       });
  },

  renderFooter: function() {
    if (this.props.location.pathname === '/') {
      return null;
    }

    return (
      <div className="footerBar">
        <a
          href="/"
          className="footerRoot"
          onClick={function(event) {
            event.preventDefault();

            return browserHistory.push('/v2');
          }}
        >
          Back to Root
        </a>
        <a
          href=""
          onClick={function(event) {
            event.preventDefault();

            return scroll(0, 0);
          }}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '1em'
          }}
        >
          "{this.getThreadTitle(this.props)}"
        </a>
        <a
          href=""
          onClick={function(event) {
            event.preventDefault();

            return scroll(0, 0);
          }}
          className="footerTop"
        >
          Top
        </a>
      </div>
    );
  },

  render: function() {
    if (this.props.params.id) {
      var threadTitle = _.find(this.props.value.topics, {
        id: parseInt(this.props.params.id, 10)
      }).title;
    }

    return (
      <div className="app">
        <ControlBar
          title={threadTitle || this.props.value.appName}
          handleRootNavigation={this.handleRootNavigation}
          handleRootRefresh={this.handleRootRefresh}
        />
        {this.props.children}
        {this.renderFooter()}
      </div>
    );
  }
});

module.exports = Root;
