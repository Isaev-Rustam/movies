export class MoviesApi {
  static transformMovies(data) {
    const movies = data?.results.map((movie) => ({
      id: movie?.id,
      title: movie?.title,
      overview: movie?.overview,
      voteAverage: movie?.vote_average.toFixed(1),
      posterPath: movie?.poster_path,
      releaseDate: movie?.release_date,
      genreIds: movie?.genre_ids.slice(0, 2),
      rating: movie.rating || 0,
    }));
    return { movies, totalPages: data.total_pages };
  }

  static transformGenre(data) {
    return data.reduce((acc, { id, name }) => {
      acc[id] = name;
      return acc;
    }, {});
  }

  apiBase = 'https://api.themoviedb.org/3/';

  apiKey = 'f34c6c5a87a1b720c85d841be1351410';

  imageBase = 'http://image.tmdb.org/t/p/';

  getImageUrl = (image, imageSize = 'w300') => `${this.imageBase}${imageSize}${image}`;

  getResource = async (url) => {
    const res = await fetch(`${this.apiBase}${url}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url} , received ${res.status}`);
    }

    return res.json();
  };

  getGenreMovieList = async () => {
    const url = `genre/movie/list?api_key=${this.apiKey}&language=en-US`;

    const { genres } = await this.getResource(url);

    return MoviesApi.transformGenre(genres);
  };

  getMovies = async (movie, currentPage) => {
    if (!movie || !currentPage) {
      return { movies: [], totalPages: 1 };
    }
    const url = `search/movie?api_key=${this.apiKey}&language=en-US&query=${movie}&page=${currentPage}&include_adult=false`;

    const res = await this.getResource(url);

    return MoviesApi.transformMovies(res);
  };

  getCreateGuestSession = async () => {
    const url = `authentication/guest_session/new?api_key=${this.apiKey}`;

    const res = await this.getResource(url);

    return { token: res.guest_session_id, expires: res.expires_at };
  };

  postMovieRating = async (token, movieId, rating) => {
    const url = `${this.apiBase}movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${token}`;

    const body = JSON.stringify({ value: rating });

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body,
    });

    if (!res.ok) {
      throw new Error(`Could not fetch ${url} , received ${res.status}`);
    }

    return res.json();
  };

  getRatedMovies = async (token, sort = 'asc') => {
    const url = `guest_session/${token}/rated/movies?api_key=${this.apiKey}&language=en-US&sort_by=created_at.${sort}`;

    const res = await this.getResource(url);

    return MoviesApi.transformMovies(res);
  };
}
