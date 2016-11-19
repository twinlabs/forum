var React = require('react');
var ThreadPost = require('./ThreadPost.jsx');
var Loader = require('./Loader.jsx');
var superagent = require('superagent');

module.exports = React.createClass({
  componentWillMount: function() {
    superagent.get(`/topic/${parseInt(this.props.routeParams.id, 10)}`)
      .set('Accept', 'application/json')
      .then(function(response){
        this.setState({
          postData: response.body[0]
        });
      }.bind(this), function(error, a, b) {
        console.error(error);
      });
  },

  render: function() {
    return (
      <div>
        <ThreadPost
          contentRenderer={require('./markdownInitializer')}
          {...this.state && this.state.postData}
        />
        <Loader />
      </div>

    )
  }
});
