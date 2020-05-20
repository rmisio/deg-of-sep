import React, { useState } from 'react';
import teams from 'data/teams';
import rosters from 'data/rosters';
import players from 'data/players';
// eslint-disable-next-line import/no-webpack-loader-syntax
import findLink from 'workerize-loader!util/findLink';
import LinkMap from 'components/LinkMap';
import NodeSelect from 'components/nodeSelect/NodeSelect';

function App() {
  const [linkData, setLinkData] = useState([]);

  // const endPlayer = '77035';
  // const before = performance.now();
  // const moo = findLink('1629632', endPlayer);
  // window.moo = moo;
  // console.log(performance.now() - before);

  // const ldData = linkData.map(ld => {
  //   const roster = rosters[ld.rosterID];
  //   const team = roster && roster.team
  //   const player = ld.playerID && players[ld.playerID];

  //   return {
  //     ...ld,
  //     teamAbbr: (team && teams[team] && teams[team].abbr) || '',
  //     number: player ? player.NUM : '',
  //     name: player ? player.name : '',
  //   };
  // });

  // const endPlayerData = players[endPlayer];

  // ldData.push({
  //   playerID: endPlayer,
  //   number: endPlayerData ? endPlayerData.NUM : '',
  //   name: endPlayerData ? endPlayerData.name : '',
  // });

  const handlePlayerChange = players => {
    console.dir(players);
    const lData = [];

    if (players && players.length === 2) {
      console.log('how bout dem cowboys!?');
    }

    setLinkData(lData);
  };

  /*
      <LinkMap
        linkData={ldData}
        playerSize={90}
        teamSize={65}
        orientation="left"
      />
  */  

  return (
    <div className="App">
      <NodeSelect
        onPlayerChange={handlePlayerChange}
      />
    </div>
  );
}

export default App;
