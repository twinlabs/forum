var React = require('react');
var browserHistory = require('react-router').browserHistory;
var superagent = require('superagent');
var _ = require('lodash/core');

var ConnectionBar = require('./ConnectionBar.jsx');
var ControlBar = require('./ControlBar.jsx');

var Root = React.createClass({
  getTitle: function(props) {
    if (!props.params.id) {
      return 'The Forum';
    }

    var thread = _.find(props.value.topics, {
      id: parseInt(props.params.id, 10)
    });

    if (thread && thread.title) {
      return thread.title;
    }

    return 'Context-Free Post...';
  },

  handleRootNavigation: function(event) {
    event.preventDefault();

    browserHistory.push('/v2');

    setTimeout(function() {
      return scroll(0, 0);
    }, 10);
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
          onClick={this.handleRootNavigation}
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
          "{this.getTitle(this.props)}"
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
    return (
      <div className="root">
        <ConnectionBar userList={this.props.value.userList} />
        <ControlBar
          title={this.getTitle(this.props)}
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
