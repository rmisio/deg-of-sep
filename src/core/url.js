export function getPlayerImageUrl(playerID, width, height) {
  const base = 'https://res.cloudinary.com/dabzwws4g/image/upload/';
  const suffix = `nba-players/${playerID}.png`;
  let size = width !== undefined ? `w_${width}` : '';
  size += height !== undefined && width !== undefined ?
    ',' : '';
  size += height !== undefined ? `h_${height}` : '';
  size = size ? `${size}/` : '';

  return base + size + suffix;
}