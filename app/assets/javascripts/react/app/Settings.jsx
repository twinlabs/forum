var React = require('react');
var ReactDOM = require('react-dom');
var Preify = require('./Preify.jsx');
var request = require('superagent');

module.exports = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();

    request.post('/settings')
      .send(this.props.settings)
      .end(function(error, response) {
        this.props.store.dispatch({
            type: 'SETTINGS',
            value: response.body
        });
      }.bind(this));
  },

  handleSigChange: function(event) {
    this.props.store.dispatch({
      type: 'SIGCHANGE',
      value: event.target.value
    })
  },

  render: function() {
    return (
      <form className="settings" onSubmit={this.handleSubmit}>
        <div className="field">
          <label>
            Signature
            <textarea
              defaultValue={this.props.settings.signature}
              onChange={this.handleSigChange}
              style={{"display": "block", "width": "100%"}}
            />
          </label>
        </div>
        <div className="field">
          <label>
            Hide Connected Status:
            <input
              defaultChecked={this.props.settings.hide_connected}
              name="hide_connected"
              type="radio"
            />
          </label>
          <label>
            Reveal Connected Status:
            <input
              defaultChecked={!this.props.settings.hide_connected}
              name="hide_connected"
              type="radio"
            />
          </label>
        </div>
        <Preify>
          {JSON.stringify(this.props.settings)}
        </Preify>
        <button>Submit</button>
        <div data-user-id={this.props.settings.id}>
          <div
            className="signature"
            dangerouslySetInnerHTML={{
              __html: this.props.settings.signature
            }}
          />
        </div>
      </form>
    )
  }
});
