import React from 'react';
import './LinkConnector.scss';

function LinkConnector(props) {
  let lcStyle = {
    width: props.width,
    height: props.length,
  };

  // todo: constantize orientations
  if (props.orientation === 'left') {
    lcStyle = {
      ...lcStyle,
      transform: 'rotate(90deg)',
      marginLeft: (props.length - props.width) / 2,
      marginRight: (props.length - props.width) / 2,
    }
  }

  return (
    <div
      className="LinkConnector"
      style={lcStyle}
    >
    </div>
  );
}

export default LinkConnector;