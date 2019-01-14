var React = require('react');

module.exports = function(props) {
  if (!props.progress) {
    return null;
  }

  return (
    <div
      className="v-Progress"
      style={{
        width: `${props.progress}%`,
      }}
    />
  );
};
