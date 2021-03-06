import React, {
  useState,
} from 'react';
import { searchPlayersByName } from 'core/searchPlayers';
import Autosuggest from 'lib/react-autosuggest';
import PlayerAvatar from 'components/PlayerAvatar';
import SelectedPlayer from './SelectedPlayer';
import './NodeSelect.scss';

function NodeSelect(props) {
  const [suggestions, setSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [players, _setPlayers] = useState([]);

  const setPlayers = newPlayers => {
    // make sure to not mutate players when calling this function
    _setPlayers(newPlayers);

    if (
      newPlayers !== players &&
      typeof props.onPlayerChange === 'function'
    ) {
      props.onPlayerChange(newPlayers);
    }
  };

  const handleSuggestionsFetchRequested = ({ value, reason }) => {
    if (reason !== 'input-changed')  return;

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
          })
          .map(suggestion => ({
            ...suggestion,
            key: suggestion.id,
          }));
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

  const handleSuggestionClearRequested = () => setSuggestions([]);

  const placeholder = players.length === 0 ?
    'Enter first player\'s name' :
    'Enter second player\'s name';

  const autosuggest = players.length < 2 ?
    (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
        renderSuggestion={renderSearchPlayer}
        onSuggestionSelected={handleSuggestionSelected}
        onSuggestionsClearRequested={handleSuggestionClearRequested}
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

  const handleRemoveClick = id => {
    setPlayers(players.filter(p => p.id !== id));
  }

  const handleClearPlayers = () => setPlayers([]);

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

    const selectedPlayersStyle = {};

    if (players.length === 2) {
      selectedPlayersStyle.marginTop = 40;
    }
      
    selectedPlayers = (
      <div
        className="NodeList-selectedPlayers"
        style={selectedPlayersStyle}
      >
        {
          players.map(player =>
            <SelectedPlayer
              id={player.id}
              key={player.id}
              name={player.name}
              onRemoveClick={() => handleRemoveClick(player.id)}
            />
          )
        }
        {btnClear}
      </div>
    );
  }
  
  return (
    <div className="NodeSelect">
      {autosuggest}
      {selectedPlayers}
    </div>
  ); 
}

export default NodeSelect;