// TODO: make readme. also for tetris.
// TODO: flex no shrink player avatar
// TODO: shorten placehold on small screens.
// TODO: test with long names.
// TODO: add in intro
// TODO: ZION to Dr J
// TODO: update index.html + meta in there
// TODO: lint this guy

import React, { useState } from 'react';
import teams from 'data/teams';
import rosters from 'data/rosters';
import players from 'data/players';
// eslint-disable-next-line import/no-webpack-loader-syntax
import FindLinkWorker from 'workerize-loader!core/findLink';
import LinkMap from 'components/LinkMap';
import { ReactComponent as FindingLinkSpinner } from 'img/three-dots.svg';
import { ReactComponent as NbaLogo } from 'img/nba-logoman-word-white.svg';
import NodeSelect from 'components/nodeSelect/NodeSelect';
import kevinBacon from 'img/kevin-bacon.png';
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
        lData = e;
        findLinkError = e;
        console.error(e);
      }

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
          There {`${degOfSep === 1 ? 'is ' : 'are '}`}
          <span className={`${resultClass}DegOfSep`}>{degOfSep}</span> {`${degOfSep === 1 ? 'degree ' : 'degrees '}`}
          of separation between the players.
        </p>
      );
    }
  }

  return (
    <div className="App">
      <header>
        <h1>
          <NbaLogo className="logo" />
          <div className="logoText">Degrees of Separation</div>
        </h1>
        <img
          className="headerImage"
          src={kevinBacon}
          alt="Kevin Bacon Straight Ballin"
        />
        <p>
          Ever hear of <a href="https://en.wikipedia.org/wiki/Six_Degrees_of_Kevin_Bacon#:~:text=Six%20Degrees%20of%20Kevin%20Bacon%20or%20%22Bacon's%20Law%22%20is%20a,and%20prolific%20actor%20Kevin%20Bacon." target="_blank">
          Six Degrees of Kevin Bacon</a>? Well, this is like that, but for NBA players.
        </p>
        <p>
          So if you've every dreamed of finding the link between Lebron James and
          Dr. J, today your dream comes true. You're welcome!&nbsp;
          <span
            className="bowingEmoji"
            role="img"
            aria-label="man bowing"
          >🙇‍</span>
        </p>
      </header>
      <NodeSelect
        onPlayerChange={handlePlayerChange}
      />
      {resultLine}
      <div className="App-linkMapWrap">
        {linkMapSpinner}
        {linkMap}
      </div>
      <footer>
        <div className="copyright">
          &copy; 2020
          <a
            href="https://robmisio.com/"
            target="_blank"
            rel="noopener noreferrer"
          >robmisio.com</a>
        </div>
        {/* { // TODO: add github link } */}
      </footer>
    </div>
  );
}

export default App;
