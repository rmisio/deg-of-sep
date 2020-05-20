import { getPlayerImageUrl } from 'util/url';
import React from 'react';
import './PlayerAvatar.scss';

function PlayerAvatar(props) {
  const size = props.size || 50;

  return (
    <div
      className="PlayerAvatar"
      style={{
        backgroundImage: `url("${getPlayerImageUrl(props.id)}")`,
        width: size,
        height: size,
      }}
    >
      
    </div>
  );
}

export default PlayerAvatar;