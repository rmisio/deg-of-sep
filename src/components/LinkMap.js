import React from 'react';
import Player from './Player';
import Team from './Team';
import LinkConnector from './LinkConnector';
import './LinkMap.scss';

function LinkMap(props) {
  let links = [];

  const createPlayer = data => {
    const playerNameLengthClass = data.name.length > 20 ?
      'LinkMap-playerWrapNameArea LinkMap-playerWrapNameAreaLongAssName' :
      'LinkMap-playerWrapNameArea';

    return (
      <div className="LinkMap-playerWrap" key={data.playerID}>
        <Player
          playerID={data.playerID}
          size={props.playerSize}
        />    
        <div className={playerNameLengthClass}>
          <div className="LinkMap-playerWrapNameAreaInner">
            <div className="LinkMap-playerWrapNum">{data.number}</div>
            <div className="LinkMap-playerWrapName"><span>{data.name.split(' ')[0]}</span> <span>{data.name.split(' ')[1]}</span></div>
          </div>
        </div>
      </div>
    );
  }

  props.linkData.forEach((link, index) => {
    if (index === props.linkData.length - 1) return;

    if (index === 0) {
      links.push(
        createPlayer({
          playerID: link.playerID,
          number: link.number,
          name: link.name,
        })
      );
    }

    links = links.concat([
      <LinkConnector key={Math.floor(Math.random() * 1000) + Date.now()} />,
      <Team teamAbbr={link.teamAbbr} key={`${link.teamAbbr}-${index}`} />,
      <LinkConnector key={Math.floor(Math.random() * 1000) + Date.now()} />,
    ]);

    const nextPlayer = props.linkData[index + 1];

    links.push(createPlayer(nextPlayer));
  });

  return (
    <div
      className="LinkMap"
    >
      {links}
    </div>
  ); 
}

export default LinkMap;