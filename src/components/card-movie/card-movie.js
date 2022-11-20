import './card-movie.css';
import { Rate } from 'antd';
import { Component } from 'react';
import * as propTypes from 'prop-types';

import HandledImage from 'components/handled-image';

class CardMovie extends Component {
  state = { rating: 0 };

  componentDidMount() {
    const { rating } = this.props;
    this.setState({ rating });
  }

  handleChange = (rating) => {
    const { id, token, postMovieRating, onError } = this.props;
    this.setState({ rating });
    if (rating > 0) {
      postMovieRating(token, id, rating).catch(onError);
    }
  };

  render() {
    const { src, alt, genreIds, genre, textTitle, color, voteAverage, date, textOverview } = this.props;
    const { rating } = this.state;

    const genreBtn = genreIds.map((id) => (
      <strong key={id} className="card-movie__btn-genre">
        {genre[id] ? genre[id] : null}
      </strong>
    ));

    return (
      <article className="card-movie">
        <div className="card__img-wrap">
          <HandledImage src={src} alt={alt} className="card-movie__img" />
        </div>
        <div className="card-movie__content">
          <div className="card-movie__header">
            <h1 className="card-movie__title">{textTitle}</h1>
            <span className="card-movie__rating" style={{ outline: `2px solid ${color}` }}>
              {voteAverage}
            </span>
            <time className="card-movie__release">{date}</time>
            <div className="card-movie__btns-genre">{genreBtn}</div>
          </div>
          <p className="card-movie__text">{textOverview}</p>
          <Rate value={rating} onChange={this.handleChange} count={10} allowHalf className="card-movie__rate" />
        </div>
      </article>
    );
  }
}

CardMovie.defaultProps = {
  alt: '',
  src: '',
  postMovieRating() {},
  genreIds: [],
  textTitle: '',
  color: 'black',
  voteAverage: '...',
  date: '...',
  textOverview: '...',
};
CardMovie.propTypes = {
  src: propTypes.string,
  alt: propTypes.string,
  color: propTypes.string,
  voteAverage: propTypes.string,
  date: propTypes.string,
  textOverview: propTypes.string,
  textTitle: propTypes.string,
  postMovieRating: propTypes.func,
  genreIds: propTypes.arrayOf(propTypes.number),
};
export default CardMovie;
