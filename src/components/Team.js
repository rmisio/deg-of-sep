import React, {
  useState,
  useEffect,
} from 'react';
import './Team.scss';

function Team(props) {
  const [teamLogoUrl, setTeamLogoUrl] = useState(null);
  const backgroundImage = teamLogoUrl ?
    `url("${teamLogoUrl}")` : '';

  useEffect(() => {
    let didCancel = false;

    async function importLogo() {
      let svgImport;

      try {
        svgImport = await import(`img/teamLogos/${props.teamAbbr}.svg`);
      } catch (e) {
        return;
      }

      if (!didCancel) {
        setTeamLogoUrl(svgImport.default);
      }
    }  

    importLogo();
    return () => {
      didCancel = true;
      setTeamLogoUrl(null);
    };
  }, [props.teamAbbr]);

  return (
    <div
      className="Team"
    >
      <div
        className="Team-innerWrap"
        style={{ backgroundImage }}
      ></div>
    </div>
  );
}

export default Team;