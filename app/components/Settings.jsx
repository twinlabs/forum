var React = require('react');
var superagent = require('superagent');
var helpers = require('../../lib/helpers');
var _ = require('lodash');

var Settings = React.createClass({
  getInitialState: function() {
    return {
      needsSave: true
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.calcNeedsSave(nextProps.settings)) {
      this.setState({
        needsSave: true
      });
    }
  },

  calcNeedsSave: function(nextSettings) {
    var thisSettings = this.props.settings;

    if (nextSettings.signature !== thisSettings.signature) {
      return true;
    }

    if (nextSettings.customCode !== thisSettings.customCode) {
      return true;
    }

    if (nextSettings.hide_connected !== thisSettings.hide_connected) {
      return true;
    }
  },

  handleSubmit: function(event) {
    event.preventDefault();

    if (this.props.settings.signature.match('script>')) {
      return this.setState({
        validationError: 'No script tags in signatures, sorry.'
      });
    }

    this.setState({
      validationError: null
    });

    document.body.classList.add('is-loading');

    superagent.post('/settings')
      .send(this.props.settings)
      .end(function(error, response) {
        document.body.classList.remove('is-loading');

        this.setState({
          needsSave: false
        });

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

  handleStyleChange: function(event) {
    this.props.store.dispatch({
      type: 'STYLECHANGE',
      value: event.target.value
    });
  },

  handleEmbedChange: function(event) {
    this.props.store.dispatch({
      type: 'EMBEDCHANGE',
      value: event.target.value
    });
  },

  getSaveButtonText: function() {
    if (!this.state.needsSave) {
      return 'Saved';
    }

    return 'Save Settings';
  },

  renderDonate: function() {
    const supporterStatus = helpers.isSupporter(window.forum.constants.user);

    return (
      <form
        action={supporterStatus.action}
        method="post"
        target="_top"
      >
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="TXU8GUQR6XA6W" />
        <button
          type="submit"
          title={supporterStatus.text}
          className="post v-Atom"
          style={{
            cursor: 'pointer',
            width: '100%'
          }}
        >
          {supporterStatus.text}
        </button>
        <img alt="" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
      </form>
    );
  },

  renderValidationError: function() {
    return (
      <div>
        {this.state.validationError}
      </div>
    );
  },

  renderValidationStyle: function() {
    if (this.state.validationError) {
      return {
        border: '4px solid red'
      };
    }
  },

  render: function() {
    return (
      <div>
        {this.renderDonate()}
        <form className="settings" onSubmit={this.handleSubmit}>
          <a
            href="https://github.com/twinlabs/forum/issues"
            target="_new"
            className="post v-Atom"
            style={{
              textAlign: 'center',
              fontSize: '1em'
            }}
          >
            Need Help? Have Feedback? Click Here to View or Open Issues
          </a>
          <div className="post v-Atom">
            <label>
              Signature:
              {this.renderValidationError()}
              <textarea
                defaultValue={this.props.settings.signature}
                onChange={this.handleSigChange}
                style={_.assign({
                  "display": "block",
                  "width": "100%",
                  'margin': '1em 0',
                  "minHeight": "400px",
                  "fontFamily": "monospace"
                }, this.renderValidationStyle())}
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
          <div className="post v-Atom">
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
          <div className="post v-Atom">
            <label>
              Style:&nbsp;
              <select
                value={this.props.settings.style}
                onChange={this.handleStyleChange}
              >
                <option value="default">default</option>
                <option value="classic">classic</option>
                <option value="neoclassical">neoclassical</option>
              </select>
            </label>
          </div>
          <div className="post v-Atom">
            <label>
              Disable Embeds:&nbsp;

              <input
                defaultChecked={this.props.settings.disableEmbeds}
                onChange={this.handleEmbedChange}
                value="true"
                name="disableEmbeds"
                type="radio"
              />
            </label>
            &nbsp;
            <label>
              Enable Embeds:&nbsp;

              <input
                defaultChecked={!this.props.settings.disableEmbeds}
                onChange={this.handleEmbedChange}
                value="false"
                name="disableEmbeds"
                type="radio"
              />
            </label>
          </div>
          <div
            style={{
              'margin': '1em 0'
            }}
          >
            <label>
              <button>{this.getSaveButtonText()}</button>
            </label>
          </div>
        </form>
      </div>
    );
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
