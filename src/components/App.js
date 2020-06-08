// TODO: make readme. also for tetris.
// TODO: flex no shrink player avatar
// TODO: shorten placehold on small screens.
// TODO: test with long names.
// TODO: add in intro
// TODO: ZION to Dr J
// TODO: update index.html + meta in there
// TODO: lint this guy
// todo: link between kareem abdul jabar in intro
// todo: byron scott showing up with james harden image
// todo: same key in linkmap when same team displayeed twice
// todo: image placeholder on mobile
// todo: result count 1 too high
// todo: scrollbar popping in and out

import React, { useState, useRef } from 'react';
// eslint-disable-next-line import/no-webpack-loader-syntax
import FindLinkWorker from 'workerize-loader!core/findLink';
import getData from 'core/getData';
import LinkMap from 'components/LinkMap';
import { ReactComponent as FindingLinkSpinner } from 'img/three-dots.svg';
import { ReactComponent as NbaLogo } from 'img/nba-logoman-word-white.svg';
import NodeSelect from 'components/nodeSelect/NodeSelect';
import kevinBacon from 'img/kevin-bacon.png';
import './App.scss';

function App() {
  const [linkMapData, setLinkMapData] = useState(null);
  const [findingLink, setFindingLink] = useState(false);
  const _getData = useRef(null);

  const handlePlayerChange = async selectedPlayers => {
    console.dir(selectedPlayers);

    let lData = null;

    if (_getData.current) _getData.current.cancel();

    if (selectedPlayers && selectedPlayers.length === 2) {
      setFindingLink(true);
      setLinkMapData(null);

      _getData.current = getData();
      console.log('cur getdata is', _getData.current.now);
    
      // test: failure / cancel of the getData process
      let data;

      try {
        data = await _getData.current.promise;
      } catch (e) {
        if (e !== 'canceled') {
          console.error('There was an error obtaining the player data:', e);
        }

        return;
      }

      const { teams, rosters, players } = data;

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
        // TODO: test this scenario
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
      <div className="App-content">
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
            Kareem Abdul-Jabbar, today your dream comes true.
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
      </footer>
    </div>
  );
}

export default App;
