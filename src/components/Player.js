import { getPlayerImageUrl } from 'util/url';
import React from 'react';
import './Player.scss';

function Player(props) {
  return (
    <div className="Player">
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