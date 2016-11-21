var React = require('react');
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

  handleStyleChange: function(event) {
    this.props.store.dispatch({
      type: 'STYLECHANGE',
      value: event.target.value
    });
  },

  render: function() {
    return (
      <form className="settings" onSubmit={this.handleSubmit}>
        <div className="input">
          <label>
            Signature:
            <textarea
              defaultValue={this.props.settings.signature}
              onChange={this.handleSigChange}
              style={{
                "display": "block",
                "width": "100%",
                'margin': '1em 0',
                "minHeight": "400px",
                "fontFamily": "monospace"
              }}
            />

            <div
              style={{
                'margin': '1em 0'
              }}
              data-user-id={this.props.settings.id}
            >
              <div
                className="signature"
                dangerouslySetInnerHTML={{
                  __html: this.props.settings.signature
                }}
              />
            </div>
          </label>
        </div>
        <div className="input">
          <label>
            Hide Connected Status:&nbsp;
            <input
              defaultChecked={this.props.settings.hide_connected}
              name="hide_connected"
              type="radio"
            />
          </label>
          &nbsp;
          <label>
            Reveal Connected Status:&nbsp;
            <input
              defaultChecked={!this.props.settings.hide_connected}
              name="hide_connected"
              type="radio"
            />
          </label>
        </div>
        <div className="input">
          <label>
            Use Forum v1:&nbsp;
            <input
              defaultChecked={!this.props.settings.is_v2}
              onChange={this.handleVersionChange}
              data-value="false"
              name="is_v2"
              type="radio"
            />
          </label>
          &nbsp;
          <label>
            Use Forum v2:&nbsp;
            <input
              defaultChecked={this.props.settings.is_v2}
              onChange={this.handleVersionChange}
              data-value="true"
              name="is_v2"
              type="radio"
            />
          </label>
        </div>
        <div className="input">
          <label>
            Style:&nbsp;
            <select
              value={this.props.settings.style}
              onChange={this.handleStyleChange}
            >
              <option value="default">default</option>
              <option value="classic">classic</option>
            </select>
          </label>
        </div>
        <div
          style={{
            'margin': '1em 0'
          }}
        >
          <label>
            <button>Save Settings</button>
          </label>
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
