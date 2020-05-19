import { getPlayerImageUrl } from 'util/url';
import React from 'react';
import './Player.scss';

function Player(props) {
  return (
    <div
      className="Player"
      style={{
        width: props.size,
        height: props.size,
      }}
    >
      <div
        className="Player-innerWrap"
        style={{
          backgroundImage: `url("${getPlayerImageUrl(props.playerID)}")`,
        }}
      >
      </div>
    </div>
  );
}

export default Player;