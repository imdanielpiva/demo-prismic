import React from 'react';
import PropTypes from 'prop-types';

import s from './Image.scss';

const Image = ({ width, height, alt, src, caption }) => (
  <div className={s.image}>
    <div className={s.image__container}>
      <figure className={s.image__figure}>
        <img className={s.image__img} src={src} alt={alt} width={width} height={height} />
        {caption && (
          <figcaption className={s.image__caption}>{caption}</figcaption>
        )}
      </figure>
    </div>
  </div>
);

Image.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  alt: PropTypes.string,
  src: PropTypes.string,
  caption: PropTypes.node,
};

export default Image;
