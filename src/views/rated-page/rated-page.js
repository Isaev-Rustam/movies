import './rated-page.css';

import { Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Component } from 'react';
import * as propTypes from 'prop-types';

import { AlertMessage, cookie } from 'utils';
import { ErrorBoundary, MovieList, Content } from 'components';

class SearchPage extends Component {
  AlertMessage = AlertMessage;

  state = {
    movies: [],
    error: false,
    loading: false,
    typeError: null,
    message: '',
  };

  componentDidMount() {
    this.getMovies();
  }

  componentDidUpdate(prevProps) {
    const { views } = this.props;
    if (views !== prevProps.views && views === 'rated-page') {
      this.getMovies();
    }
  }

  getMovies() {
    const { getRatedMovies } = this.props;
    const token = cookie.get('token-guest-sessions');
    if (token) {
      getRatedMovies(token, 'desc').then(this.onLoading).catch(this.onError);
    }
  }

  onLoading = ({ movies }) => {
    if (movies.length) {
      this.setState(() => ({ movies, error: false, loading: false, typeError: null, message: '' }));
    } else {
      this.setState(() => ({ movies: [], error: true, loading: false, typeError: 'info', message: 'rated' }));
    }
  };

  onError = () => {
    this.setState(() => ({ error: true, loading: false, typeError: 'error', message: 'error' }));
  };

  render() {
    const { movies, error, loading, typeError, message } = this.state;
    const { postMovieRating, getImgUrl, token } = this.props;

    const alert = error ? (
      <Alert message="Error" type={typeError} {...this.AlertMessage[message]} showIcon closable />
    ) : null;
    const spin = loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 100 }} />} /> : null;
    const movieList = !(error || loading) ? (
      <MovieList
        onError={this.onError}
        token={token}
        postMovieRating={postMovieRating}
        movies={movies}
        getImgUrl={getImgUrl}
      />
    ) : null;

    return (
      <ErrorBoundary>
        <section className="page">
          <Content loading={loading} error={error}>
            <ErrorBoundary>
              {spin}
              {alert}
              {movieList}
            </ErrorBoundary>
          </Content>
        </section>
      </ErrorBoundary>
    );
  }
}
SearchPage.defaultProps = {
  token: '',
  views: 'rated-page',
  getRatedMovies: () => {},
  getImgUrl: () => {},
  postMovieRating: () => {},
};
SearchPage.propTypes = {
  views: propTypes.string,
  token: propTypes.string,
  getRatedMovies: propTypes.func,
  getImgUrl: propTypes.func,
  postMovieRating: propTypes.func,
};
export default SearchPage;
