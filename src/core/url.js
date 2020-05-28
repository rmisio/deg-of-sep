export function getPlayerImageUrl(playerID, width, height=width) {
  const base = 'https://res.cloudinary.com/dabzwws4g/image/upload/v1/';
  const suffix = `nba-players/${playerID}.png`;
  let size = width !== undefined ? `w_${width}` : '';
  size += height !== undefined && width !== undefined ?
    ',' : '';
  size += height !== undefined ? `h_${height}` : '';

  return base + size + suffix;
}

export function getTeamImageUrl(teamAbbr) {
  return `https://stats.nba.com/media/img/teams/logos/${teamAbbr}_logo.svg`;
}