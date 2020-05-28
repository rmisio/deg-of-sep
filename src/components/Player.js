import React from 'react';
import PlayerAvatar from 'components/PlayerAvatar';
import './Player.scss';

function Player(props) {
  return (
    <div className="Player">
      <PlayerAvatar id={props.playerID} />
    </div>
  );
}

export default Player;