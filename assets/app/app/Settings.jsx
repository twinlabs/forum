var React = require('react');
var ReactDOM = require('react-dom');
var Preify = require('./Preify.jsx');
var superagent = require('superagent');

var Settings = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();

    superagent.post('/settings')
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

  handleVersionChange: function(event) {
    this.props.store.dispatch({
      type: 'VERSION',
      value: event.target.dataset.value === "true"
    })
  },

  render: function() {
    return (
      <form className="settings" onSubmit={this.handleSubmit}>
        <div className="field">
          <label>
            Signature
            <textarea
              className="preify input"
              defaultValue={this.props.settings.signature}
              onChange={this.handleSigChange}
              style={{
                "display": "block",
                "width": "100%",
                "minHeight": "400px"
              }}
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
        <div className="field">
          <label>
            Use v1:
            <input
              defaultChecked={!this.props.settings.is_v2}
              onChange={this.handleVersionChange}
              data-value="false"
              name="is_v2"
              type="radio"
            />
          </label>
          <label>
            Use v2
            <input
              defaultChecked={this.props.settings.is_v2}
              onChange={this.handleVersionChange}
              data-value="true"
              name="is_v2"
              type="radio"
            />
          </label>
        </div>
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

module.exports = React.createClass({
  render: function() {
    return (
      <Settings
        settings={this.props.value.settings}
        store={window.store}
      />
    );
  }
})
