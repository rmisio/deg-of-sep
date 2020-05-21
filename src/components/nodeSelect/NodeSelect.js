// TODO: filter out same player twice
// TODO: cancel link find at appropo times
import React, { useState } from 'react';
import { searchPlayersByName } from 'util/searchPlayers';
// eslint-disable-next-line import/no-webpack-loader-syntax
import FindLinkWorker from 'workerize-loader!util/findLink';
import Autosuggest from 'react-autosuggest';
import PlayerAvatar from 'components/PlayerAvatar';
import SelectedPlayer from './SelectedPlayer';
import './NodeSelect.scss';

function NodeSelect(props) {
  const {
    onFindingLink,
    onFindingLinkResult,
    onFindingLinkCancel,
    onPlayerChange,
  } = props;

  const [suggestions, setSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [players, _setPlayers] = useState([]);
  const [findingLink, setFindingLink] = useState(false);
  const [degOfSep, setDegOfSep] = useState(null);

  const setPlayers = async newPlayers => {
    // make sure to not mutate players when calling this function
    _setPlayers(newPlayers);

    if (newPlayers !== players) {
      if (typeof onPlayerChange === 'function') {
        onPlayerChange(newPlayers);
      }

      if (newPlayers && newPlayers.length === 2) {
        setFindingLink(true);

        if (typeof onFindingLink === 'function') {
          onFindingLink();
        }

        const findLinkWorker = FindLinkWorker();
        let link = null;
        let linkFindError = null;

        try {
          link =
            await findLinkWorker
              .findLink(newPlayers[0].id, newPlayers[1].id);
        } catch (e) {
          // TODO: test this
          linkFindError = e;
          setDegOfSep(null);
        }

        setFindingLink(false);

        if (typeof onFindingLinkResult === 'function') {
          onFindingLinkResult(linkFindError || link);
        }

        if (linkFindError) return;

        setDegOfSep(link === null ? Infinity: link.length);
      } else {
        // TODO: what about a cancel link
        setFindingLink(false);
        setDegOfSep(null);
      }
    }
  };

  const handleSuggestionsFetchRequested = ({ value }) => {
    const inputVal = value.trim();
    let suggestions = [];

    // todo: memoize the sorting. Or bake in a sort option into
    // searchPlayersByName and memoize that.
    if (inputVal.length >= 3) {
      suggestions =
        searchPlayersByName(inputVal)
          .sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            return 0;            
          });
    }

    setSuggestions(suggestions);
  };

  const handleSearchChange = (e, { newValue, method }) => {
    setSearchValue(newValue);
  };

  const renderSearchPlayer = player => {
    return (
      <div className="NodeList-playerSuggestion">
        <PlayerAvatar id={player.id} size={35} />
        <div>{player.name}</div>
      </div>
    );
  };

  const getSuggestionValue = suggestion => suggestion.name;

  const handleSuggestionSelected = (e, { suggestion }) => {
    setPlayers(players.concat(suggestion));
    setSearchValue('');
    setSuggestions([]);
  };

  const placeholder = players.length === 0 ?
    'Enter a player\'s name (e.g. Lebron James)' :
    'Enter another player\'s name (e.g. Bill Russell)';

  const autosuggest = players.length < 2 ?
    (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
        renderSuggestion={renderSearchPlayer}
        onSuggestionSelected={handleSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        highlightFirstSuggestion={true}
        inputProps={{
          value: searchValue,
          onChange: handleSearchChange,
          placeholder,
        }}
      />      
    ) : null;

  let selectedPlayers = null;

  const handleRemoveClick = id => setPlayers(players.filter(p => p.id !== id));
  const handleClearPlayers = () => setPlayers([]);

  const createSelectedPlayer = pData => (
    <SelectedPlayer
      id={pData.id}
      key={pData.id}
      name={pData.name}
      onRemoveClick={() => handleRemoveClick(pData.id)}
    />    
  );

  if (players.length) {
    const btnClear = players.length === 2 ?
      (
        <div>
          <button
            className="btnAsLink"
            onClick={handleClearPlayers}
          >Start Over</button>        
        </div>
      ) : null;

    if (players.length < 2) {
      selectedPlayers = (
        <div className="NodeList-selectedPlayers">
          {createSelectedPlayer(players[0])}
        </div>
      );
    } else if (players.length === 2) {
      if (findingLink) {
        selectedPlayers = (
          <div className="NodeList-selectedPlayers NodeList-selectedPlayersFindingLink">
            {players.map(player => createSelectedPlayer(player))}
            {btnClear}
          </div>
        );
      } else if (degOfSep === Infinity) {
        selectedPlayers = (
          <div className="NodeList-selectedPlayers">
            <span>There is no link between</span>
            <span>{createSelectedPlayer(players[0])}</span>
            <span>and</span>
            <span>{createSelectedPlayer(players[1])}</span>
            <span className="NodeList-selectedPlayersPeriod">.</span>
          </div>
        );
      } else {
        selectedPlayers = (
          <div className="NodeList-selectedPlayers">
            <span>There {degOfSep === 1 ? 'is' : 'are'}</span>
            <span className="NodeList-selectedPlayersDegOfSepCount">
              {degOfSep}
            </span>
            <span>degrees of separation between</span>
            <span>{createSelectedPlayer(players[0])}</span>
            <span>and</span>
            <span>{createSelectedPlayer(players[1])}</span>
            <span className="NodeList-selectedPlayersPeriod">.</span>
          </div>
        );
      }
    }
  }
  
  // TODO: move margin to css file.
  return (
    <div
      className="NodeSelect"
      style={{ marginBottom: 25 }}
    >
      {autosuggest}
      {selectedPlayers}
    </div>
  ); 
}

export default NodeSelect;