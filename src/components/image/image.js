import * as propTypes from 'prop-types';
import './image.css';

function Image({ src, alt, onLoad, onError, className, style }) {
  return <img src={src} alt={alt} onError={onError} onLoad={onLoad} className={className} style={style} />;
}

Image.defaultProps = {
  src: '',
  alt: '',
  onLoad: () => {},
  onError: () => {},
  className: '',
  style: {},
};
Image.propTypes = {
  src: propTypes.string,
  alt: propTypes.string,
  onLoad: propTypes.func,
  onError: propTypes.func,
  className: propTypes.string,
  style: propTypes.shape({}),
};

export default Image;
