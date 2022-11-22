import 'antd/dist/antd.min.css';
import './app.css';
import { Alert, Tabs } from 'antd';
import { Component } from 'react';

import { SearchPage, RatedPage } from 'views';
import { GenreProvider } from 'components/genre-context';
import { MoviesApi } from 'services';
import { cookie } from 'utils';

class App extends Component {
  moviesApi = new MoviesApi();

  COOKIE_KEY = 'token-guest-sessions';

  state = {
    genre: {},
    token: null,
    guestSessionError: false,
    loadingGuestSession: true,
    genreError: false,
    loadingGenre: true,
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
    this.setState(() => ({ genre, genreError: false, loadingGenre: false }));
  };

  onErrorGenre = () => {
    this.setState(() => ({ genre: {}, genreError: true, loadingGenre: false }));
  };

  onLoadingGuestSession = ({ token, expires }) => {
    cookie.set(this.COOKIE_KEY, token, expires);
    this.setState(() => ({ token, guestSessionError: false, loadingGuestSession: false }));
  };

  onErrorGuestSession = () => {
    this.setState(() => ({ guestSessionError: true, loadingGuestSession: false }));
  };

  createGuestSession = () => {
    const token = cookie.get(this.COOKIE_KEY);
    if (token) {
      this.setState({ token, guestSessionError: false, loadingGuestSession: false });
    } else {
      this.moviesApi.getCreateGuestSession().then(this.onLoadingGuestSession).catch(this.onErrorGuestSession);
    }
  };

  render() {
    const { genre, token, views, guestSessionError, genreError, loadingGenre, loadingGuestSession } = this.state;

    const hesAlert = genreError && !loadingGenre && guestSessionError && !loadingGuestSession;
    const alert = hesAlert ? (
      <Alert
        type="error"
        message="Ошибка при запросе."
        description="Проверьте сетевое подключение или включен ли у вас vpn."
        showIcon
        closable
      />
    ) : null;

    const page = [
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
            getMovies={this.moviesApi.getRatedMovies}
            getImgUrl={this.moviesApi.getImageUrl}
            postMovieRating={this.moviesApi.postMovieRating}
            views={views}
          />
        ),
      },
    ];

    return (
      <GenreProvider value={genre}>
        {alert}
        <Tabs onChange={this.onChange} items={page} />
      </GenreProvider>
    );
  }
}

export default App;
