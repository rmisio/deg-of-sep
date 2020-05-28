import { getTeamImageUrl } from 'core/url';
import React from 'react';
import './Team.scss';

function Team(props) {
  return (
    <div
      className="Team"
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