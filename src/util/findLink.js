import players from 'data/players';
import rosters from 'data/rosters';

class PlayerNode {
  constructor(options) {
    this.id = options.id;
    this.parent = options.parent || null;
    this.roster = options.roster;
  }
}

const findDirectLink = (playerA, playerB) => {
  const rootPlayer = players[playerA];

  if (!rootPlayer) {
    throw new Error(`Unable to find ${playerA}`);
  }

  const teammates = new Map();
  
  for (let i = 0; i < (rootPlayer.rosters || []).length; i++) {
    const rosterID = rootPlayer.rosters[i];
    const roster = rosters[rosterID];

    if (!roster) continue;

    const rosterPlayers = Array.isArray(roster.players) ?
      roster.players : [];

    for (let j = 0; j < rosterPlayers.length; j++) {
      const player = rosterPlayers[j];

      if (player === playerA) continue;

      if (player === playerB) {
        return {
          directLink: true,
          roster: rosterID,
        };
      }

      if (!teammates.has(player)) {
        teammates.set(player, {
          id: player,
          roster: rosterID,
        });
      }
    }
  }

  return {
    directLink: false,
    teammates,
  }
}

export function findLink(playerA, playerB) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const boom = Math.random() * (10 - 1) + 1;

      if (boom < 3) {
        reject(new Error('how dare you!?'));
      } else if (boom < 6.5)  {
        resolve(findLink2(playerA, playerB));
      } else {
        resolve(null);  
      }
    }, 1000);
  });
}

export function findLink2(playerA, playerB) {
  let endNode = null;
  let teammates = [
    new PlayerNode({
      id: playerA,
    }),
  ];

  // TODO: ensure players aren't checked twice
  const teammatesChecked = [];

  while (!endNode && teammates.length) {
    let newTeammates = [];

    for (let i = 0; i < teammates.length; i++) {
      const teammate = teammates[i];
      const dl = findDirectLink(teammate.id, playerB);

      if (dl.directLink) {
        endNode = new PlayerNode({
          id: playerB,
          parent: teammate,
          roster: dl.roster,
        });
        break;
      } else {
        dl.teammates.forEach(tm => {
          if (!teammatesChecked.includes(tm.id)) {
            newTeammates.push(
              new PlayerNode({
                ...tm,
                parent: teammate,
              })
            );
            teammatesChecked.push(tm.id);
          }
        });
      }
    }

    teammates = newTeammates;
  }

  if (endNode) {
    // reverse the list
    const list = [];
    let node = endNode;
    let prevNode;

    while (node) {
      if (!prevNode) {
        prevNode = node;
        node = node.parent;
        continue;
      }

      list.unshift({
        playerID: node.id,
        rosterID: prevNode.roster,
        linkedPlayer: prevNode.id,
      });

      prevNode = node;
      node = node.parent;
    }

    return list;
  }

  return null;
};