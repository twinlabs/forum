var React = require('react');

var createReactClass = require('create-react-class');

var ConnectionBar = createReactClass({
  displayName: 'ConnectionBar',

  render: function() {
    return (
      <div className="connectionBar">
        <div style={{ marginRight: '0.5em' }}>Connected:</div>
        {Object.keys(this.props.userList).map(function(userName, index) {
          return (
            <div key={index} className="connectionBar-name activity-users-user">
              {userName}
            </div>
          );
        })}
      </div>
    );
  },
});

module.exports = ConnectionBar;
