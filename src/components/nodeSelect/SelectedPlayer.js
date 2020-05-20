import React from 'react';
import IosClose from 'react-ionicons/lib/IosClose';
import PlayerAvatar from 'components/PlayerAvatar';
import './SelectedPlayer.scss';

function SelectedPlayer(props) {
  const handleRemoveClick = () => {
    if (typeof props.onRemoveClick === 'function') {
      props.onRemoveClick();
    }
  };

  return (
    <div
      className="SelectedPlayer"
    >
      <PlayerAvatar id={props.id} size={35} />
      <div>{props.name}</div>
      <button
        className="btnTxtOnly SelectedPlayer-btnRemove"
        onClick={handleRemoveClick}
      >
        <IosClose fontSize="20" />
      </button>
    </div>
  );
}

export default SelectedPlayer;