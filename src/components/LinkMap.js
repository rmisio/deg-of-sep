import React from 'react';
import Player from './Player';
import Team from './Team';
import LinkConnector from './LinkConnector';
import './LinkMap.scss';

// const orientationTypes = [
//   'top', // top to bottom
//   'left', // left to right
//   'snake', // left to right to left to right to left...
// ];

function LinkMap(props) {
  const links = [];

  const createPlayer = data => {
    const splitName = data.name.split(' ');
    const fName = splitName[0];
    const lName = splitName.slice(1).join(' ');

    return (
      <div className="LinkMap-playerWrap">
        <div className="LinkMap-playerWrapNameArea">
          <div className="LinkMap-playerWrapNameAreaInner">
            <div className="LinkMap-playerWrapNum">{data.number}</div>
            <div className="LinkMap-playerWrapName">
              <span>{fName}</span> <span>{lName}</span>
            </div>
          </div>
        </div>
        <Player
          playerID={data.playerID}
          size={props.playerSize}
        />      
      </div>
    );
  };

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

    links.push(
      <LinkConnector
        width={10}
        length={30}
        orientation="left"
      />
    );

    links.push(
      <Team
        teamAbbr={link.teamAbbr}
        size={props.teamSize}
      />
    );

    links.push(
      <LinkConnector
        width={10}
        length={30}
        orientation="left"
      />
    );

    const nextPlayer = props.linkData[index + 1];

    links.push(createPlayer(nextPlayer));
  });

  return (
    <div
      className={`LinkMap LinkMap-orientation-${props.orientation}`}
    >
      {links}
    </div>
  ); 
}

export default LinkMap;