// TODO: Players with names consisting of more than 2 parts are having
// everything after the second part cut off. For example, Keith Van Horn
// is showing up as Keith Van.

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