import players from 'data/players';

let _playerNameMap = null;

function getPlayerNameMap() {
  if (_playerNameMap) return _playerNameMap;

  _playerNameMap = new Map();

  Object
    .keys(players)
    .forEach(playerID => {
      const name = players[playerID].name;

      if (!name) return;

      const names = name.split(' ');

      names.forEach(name => {
        const n = name.toUpperCase();
        const list = _playerNameMap.get(n) || [];
        list.push({
          id: playerID,
          ...players[playerID],
        });
        _playerNameMap.set(n, list)
      });
    });

  return _playerNameMap;
}

export function searchPlayersByName(term) {
  if (typeof term !== 'string') {
    throw new Error('Please provide a search term as a string.');
  }

  const sTerm = term.toUpperCase();
  let results = [];
  const players = getPlayerNameMap();

  // Given that we only have about 4k or so players, the following approach
  // is fine. If we ever abstract this to support potentially much larger
  // data sets, we'll probably want to adjust... maybe:
  // http://elasticlunr.com/
  [...players.keys()]
    .forEach(nameKey => {
      if (nameKey.includes(sTerm)) {
        results = results.concat(players.get(nameKey));
      }
    });

  return results;
}