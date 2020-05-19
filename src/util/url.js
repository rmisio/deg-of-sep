// todo: rename containing folder to core

export function getPlayerImageUrl(playerID) {
  return 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/' +
    `latest/260x190/${playerID}.png`;
}

export function getTeamImageUrl(teamAbbr) {
  return `https://stats.nba.com/media/img/teams/logos/${teamAbbr}_logo.svg`;
}