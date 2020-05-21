import React from 'react';
import './LinkConnector.scss';

function LinkConnector(props) {
  let lcStyle = {
    width: props.width,
    height: props.length,
  };

  // todo: constantize orientations
  // if (props.orientation === 'left') {
  //   lcStyle = {
  //     ...lcStyle,
  //     transform: 'rotate(90deg)',
  //     marginLeft: (props.length - props.width) / 2,
  //     marginRight: (props.length - props.width) / 2,
  //   }
  // }

  return (
    <svg
      className="LinkConnector"
      // style={lcStyle}
    >
      <line x1="0" y1="0" x2="50" y2="0" />
    </svg>
  );
}

export default LinkConnector;