// TODO: There are is 1 degree of separation between the players.
// TODO: There are are ...


import React, { useState } from 'react';
import teams from 'data/teams';
import rosters from 'data/rosters';
import players from 'data/players';
// eslint-disable-next-line import/no-webpack-loader-syntax
import FindLinkWorker from 'workerize-loader!util/findLink';
import LinkMap from 'components/LinkMap';
import { ReactComponent as FindingLinkSpinner } from 'img/three-dots.svg';
import NodeSelect from 'components/nodeSelect/NodeSelect';
import './App.scss';

function App() {
  const [linkMapData, setLinkMapData] = useState(null);
  const [findingLink, setFindingLink] = useState(false);

  const handlePlayerChange = async selectedPlayers => {
    let lData = null;

    if (selectedPlayers && selectedPlayers.length === 2) {
      setFindingLink(true);
      setLinkMapData(null);
      
      const findLinkWorker = FindLinkWorker();
      let link = null;
      let findLinkError = null;

      try {
        link =
          await findLinkWorker
            .findLink(selectedPlayers[0].id, selectedPlayers[1].id);
      } catch (e) {
        // TODO: test me
        // console.log('find link errah');
        // console.dir(e);
        lData = e;
        findLinkError = e;
        console.error(e);
      }

      console.log('how bout dem beavers');
      console.dir(link);

      if (link === null && !findLinkError) {
        // There is no link between the players
        lData = Infinity;
      }

      if (link !== null) {
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
          playerID: selectedPlayers[1].id,
          number: endPlayerData ? endPlayerData.NUM : '',
          name: endPlayerData ? endPlayerData.name : '',
        });
      }
    }

    setFindingLink(false);
    setLinkMapData(lData);
  };

  const linkMap = Array.isArray(linkMapData) ?
    (
      <LinkMap
        linkData={linkMapData}
      />      
    ) : null;

  const linkMapSpinner = findingLink ?
    <FindingLinkSpinner className="App-findingLinkSpinner" /> :
    null;

  // TODO: maybe some result line icons...?
  let resultLine = null;

  if (!findingLink) {
    const resultClass = 'App-linkMapResult';

    if (linkMapData instanceof Error) {
      resultLine = (
        <p className={`${resultClass} ${resultClass}Error`}>
          There was an error finding the link.
        </p>
      );
    } else if (linkMapData === Infinity) {
      resultLine = (
        <p className={resultClass}>
          There is no direct link between the players.
        </p>
      );
    } else if (linkMap && linkMapData.length === 1) {
      resultLine = (
        <p className={resultClass}>
          The two players are directly linked.
        </p>
      );
    } else if (linkMap) {
      const degOfSep = linkMapData.length - 1;
      resultLine = (
        <p className={resultClass}>
          There are {`${degOfSep === 1 ? 'is ' : 'are '}`}
          <span className={`${resultClass}DegOfSep`}>{degOfSep}</span> {`${degOfSep === 1 ? 'degree ' : 'degrees '}`}
          of separation between the players.
        </p>
      );
    }
  }

  return (
    <div className="App">
      <NodeSelect
        onPlayerChange={handlePlayerChange}
      />
      {resultLine}
      <div className="App-linkMapWrap">
        {linkMapSpinner}
        {linkMap}
      </div>
    </div>
  );
}

export default App;
