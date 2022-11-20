import 'antd/dist/antd.css';
import './app.css';
import { Alert, Tabs } from 'antd';
import { Component } from 'react';

import { SearchPage, RatedPage } from 'views';
import { GenreProvider } from 'components/genre-context';
import { MoviesApi } from 'services';
import { cookie } from 'utils';

class App extends Component {
  moviesApi = new MoviesApi();

  state = {
    genre: {},
    token: null,
    guestSessionError: false,
    genreError: false,
    views: 'search-page',
  };

  componentDidMount() {
    this.createGuestSession();
    this.getGenre();
  }

  onChange = (views) => {
    this.setState(() => ({ views }));
  };

  getGenre() {
    this.moviesApi.getGenreMovieList().then(this.onLoadingGenre).catch(this.onErrorGenre);
  }

  onLoadingGenre = (genre) => {
    if (Object.keys(genre).length) {
      this.setState(() => ({ genre, genreError: false }));
    } else {
      this.setState(() => ({ genre: {}, genreError: false }));
    }
  };

  onErrorGenre = () => {
    this.setState(() => ({ genreError: true }));
  };

  onLoadingGuestSession = ({ token, expires }) => {
    cookie.set('token-guest-sessions', token, expires);
    this.setState(() => ({ token, guestSessionError: false }));
  };

  onErrorGuestSession = () => {
    this.setState(() => ({ guestSessionError: true }));
  };

  createGuestSession() {
    const token = cookie.get('token-guest-sessions');
    if (token) {
      this.setState({ token, guestSessionError: false });
    } else {
      this.moviesApi.getCreateGuestSession().then(this.onLoadingGuestSession).catch(this.onErrorGuestSession);
    }
  }

  render() {
    const { genre, token, views, guestSessionError, genreError } = this.state;

    const alert =
      genreError || guestSessionError ? (
        <Alert
          type="error"
          message="Ошибка при запросе."
          description="Проверьте сетевое подключение."
          showIcon
          closable
        />
      ) : null;

    return (
      <GenreProvider value={genre}>
        {alert}
        <Tabs
          onChange={this.onChange}
          items={[
            {
              label: 'Search',
              key: 'search-page',
              children: (
                <SearchPage
                  token={token}
                  getMovies={this.moviesApi.getMovies}
                  getImgUrl={this.moviesApi.getImageUrl}
                  postMovieRating={this.moviesApi.postMovieRating}
                />
              ),
            },
            {
              label: 'Rated',
              key: 'rated-page',
              children: (
                <RatedPage
                  token={token}
                  views={views}
                  getRatedMovies={this.moviesApi.getRatedMovies}
                  getImgUrl={this.moviesApi.getImageUrl}
                  postMovieRating={this.moviesApi.postMovieRating}
                />
              ),
            },
          ]}
        />
      </GenreProvider>
    );
  }
}

export default App;
