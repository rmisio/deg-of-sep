import React from 'react';
import teams from 'data/teams';
import rosters from 'data/rosters';
import players from 'data/players';
import findLink from 'util/findLink';
import LinkMap from 'components/LinkMap';

function App() {
  const endPlayer = '77035';
  const before = performance.now();
  const linkData = findLink('1629632', endPlayer);
  console.log(performance.now() - before);

  const ldData = linkData.map(ld => {
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

  const endPlayerData = players[endPlayer];

  ldData.push({
    playerID: endPlayer,
    number: endPlayerData ? endPlayerData.NUM : '',
    name: endPlayerData ? endPlayerData.name : '',
  });

  return (
    <div className="App">
      <LinkMap
        linkData={ldData}
        playerSize={90}
        teamSize={65}
        orientation="left"
      />
    </div>
  );
}

export default App;
