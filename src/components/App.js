import React, { useState } from 'react';
import teams from 'data/teams';
import rosters from 'data/rosters';
import players from 'data/players';
// eslint-disable-next-line import/no-webpack-loader-syntax
import FindLinkWorker from 'workerize-loader!util/findLink';
import LinkMap from 'components/LinkMap';
import NodeSelect from 'components/nodeSelect/NodeSelect';

function App() {
  const [linkMapData, setLinkMapData] = useState([]);

  const handlePlayerChange = async selectedPlayers => {
    let lData = null;

    if (selectedPlayers && selectedPlayers.length === 2) {
      const findLinkWorker = FindLinkWorker();
      const link = await findLinkWorker.findLink(selectedPlayers[0].id, selectedPlayers[1].id)

      lData = link.map(ld => {
        const roster = rosters[ld.rosterID];
        const team = roster && roster.team
        const player = ld.playerID && players[ld.playerID];

        return {
          ...ld,
          teamAbbr: (team && teams[team] && teams[team].abbr) || '',
          number: player ? player.NUM : '',
          name: player ? player.name : '',
        };
      });

      const endPlayerData = players[selectedPlayers[1].id];

      lData.push({
        playerID: endPlayerData.playerID,
        number: endPlayerData ? endPlayerData.NUM : '',
        name: endPlayerData ? endPlayerData.name : '',
      });
    }

    setLinkMapData(lData);
  };

  const linkMap = linkMapData ?
    (
      <LinkMap
        linkData={linkMapData}
        playerSize={90}
        teamSize={65}
        orientation="left"
      />      
    ) : null;

  return (
    <div className="App">
      <NodeSelect
        onPlayerChange={handlePlayerChange}
      />
      {linkMap}
    </div>
  );
}

export default App;
