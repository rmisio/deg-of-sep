import { getTeamImageUrl } from 'util/url';
import React from 'react';
import './Team.scss';

function Team(props) {
  return (
    <div
      className="Team"
      style={{
        width: props.size,
        height: props.size,
      }}
    >
      <div
        className="Team-innerWrap"
        style={{
          backgroundImage: `url("${getTeamImageUrl(props.teamAbbr)}")`,
        }}
      ></div>
    </div>
  );
}

export default Team;