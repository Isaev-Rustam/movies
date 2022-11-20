import './movie-list.css';
import { format } from 'date-fns';
import * as propTypes from 'prop-types';

import { cutString, colorPicker } from 'utils';
import CardMovie from 'components/card-movie';
import { GenreConsumer } from 'components/genre-context';

function MovieList({ movies, getImgUrl, postMovieRating, token, onError }) {
  return movies.map(({ id, title, overview, voteAverage, posterPath, releaseDate, genreIds, rating }) => {
    const date = releaseDate ? format(new Date(releaseDate), 'MMMM d yyyy') : 'M D Y';
    const textTitle = title ? cutString(title, 15) : '...';
    const textOverview = overview ? cutString(overview, 175) : '...';
    const color = colorPicker(voteAverage);
    const src = getImgUrl(posterPath);

    return (
      <GenreConsumer key={id}>
        {(genre) => (
          <CardMovie
            id={id}
            src={src}
            token={token}
            postMovieRating={postMovieRating}
            onError={onError}
            rating={rating}
            textOverview={textOverview}
            date={date}
            color={color}
            voteAverage={voteAverage}
            textTitle={textTitle}
            alt="movie picture"
            genreIds={genreIds}
            genre={genre}
          />
        )}
      </GenreConsumer>
    );
  });
}

MovieList.defaultProps = {
  movies: [],
  token: '',
  getImgUrl: () => {},
  postMovieRating: () => {},
  onError: () => {},
};
MovieList.propTypes = {
  movies: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.number,
      title: propTypes.string,
      overview: propTypes.string,
      voteAverage: propTypes.string,
      posterPath: propTypes.string,
      releaseDate: propTypes.string,
      genreIds: propTypes.arrayOf(propTypes.number),
      rating: propTypes.number,
    })
  ),
  token: propTypes.string,
  getImgUrl: propTypes.func,
  postMovieRating: propTypes.func,
  onError: propTypes.func,
};

export default MovieList;
