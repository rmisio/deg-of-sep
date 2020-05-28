// todo: move images to cloudinary

import React, {
  useCallback,
  useRef,
} from 'react';
import { getPlayerImageUrl } from 'core/url';
import DefaultAvatar from 'img/nba-logoman-word-white.svg';
import './PlayerAvatar.scss';

function PlayerAvatar(props) {
  let playerImage = useRef();
  let playerImageLoaded = useRef(false);
  let playerImageError = useRef(false);
  let containerEl = useRef(null);
  const style = {};

  const containerElRef = useCallback(node => {
    let { current: image } = playerImage;
    const playerUrl = getPlayerImageUrl(props.id);
    containerEl.current = node;

    const setErrorState = (node) => {
      node.style.backgroundImage = `url("${DefaultAvatar}")`;
      node.classList.add('PlayerAvatar-defaultAvatar');
    };

    const setLoadedState = (node, url) => {
      node.style.backgroundImage = `url("${url}")`;
    };

    if (node !== null) {
      if (!image) {
        image = new Image()
        image.src = playerUrl;
        
        image.onerror = () => {
          if (!containerEl.current) return;
          playerImageError.current = true;
          setErrorState(containerEl.current);
        };

        image.onload = () => {
          if (!containerEl.current) return;
          playerImageLoaded.current = true;
          setLoadedState(containerEl.current, playerUrl);
        };

        playerImage.current = image;
      }

      if (playerImageLoaded.current) {
        setLoadedState(node, image.src);
      } else if (playerImageError.current) {
        setErrorState(node);
      }
    } else if (image) {
      image.src = '';
    }
  }, [props.id]);

  if (props.size !== undefined) {
    style.width = props.size;
    style.height = props.size;
  }

  return (
    <div
      className="PlayerAvatar"
      style={style}
      ref={containerElRef}
    ></div>
  );
}

export default PlayerAvatar;