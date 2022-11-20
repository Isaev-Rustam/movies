import './search-page.css';

import { Input, Pagination, Alert, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Component } from 'react';
import { debounce } from 'lodash';
import * as propTypes from 'prop-types';

import { AlertMessage } from 'utils';
import { ErrorBoundary, MovieList, Content } from 'components';

class SearchPage extends Component {
  AlertMessage = AlertMessage;

  debounce = debounce((search, currentPage) => this.getMovies(search, currentPage), 450);

  state = {
    movies: [],
    error: false,
    loading: false,
    typeError: null,
    message: '',
    search: '',
    currentPage: 1,
    totalPages: 10,
  };

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    const { search, currentPage } = this.state;
    if (currentPage !== prevState.currentPage || search !== prevState.search) {
      this.debounce(search, currentPage);
      window.scrollTo(0, 0);
    }
  }

  getMovies(search, currentPage) {
    const { getMovies } = this.props;
    getMovies(search, currentPage).then(this.onLoading).catch(this.onError);
  }

  onLoading = ({ movies, totalPages }) => {
    if (movies.length) {
      this.setState(() => ({ movies, totalPages, error: false, loading: false, typeError: null, message: '' }));
    } else {
      this.setState(() => ({
        movies: [],
        totalPages,
        error: true,
        loading: false,
        typeError: 'info',
        message: 'info',
      }));
    }
  };

  onError = () => {
    this.setState(() => ({ error: true, loading: false, typeError: 'error', message: 'error' }));
  };

  searchMovie = (movie, page) => {
    this.setState({ search: movie, currentPage: page });
  };

  onSearch = ({ target: { value } }) => {
    if (!value.trim()) {
      this.setState({ search: '', movies: [] });
      return;
    }
    this.searchMovie(value, 1);
  };

  onChangePagination = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const { movies, totalPages, currentPage, error, loading, search, typeError, message } = this.state;
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
          <Input value={search} maxLength={40} onChange={this.onSearch} placeholder="Type to search..." allowClear />
          <Content loading={loading} error={error}>
            <ErrorBoundary>
              {spin}
              {alert}
              {movieList}
            </ErrorBoundary>
          </Content>
          <Pagination current={currentPage} onChange={this.onChangePagination} total={totalPages} />
        </section>
      </ErrorBoundary>
    );
  }
}
SearchPage.defaultProps = {
  token: '',
  getMovies: () => {},
  getImgUrl: () => {},
  postMovieRating: () => {},
};
SearchPage.propTypes = {
  token: propTypes.string,
  getMovies: propTypes.func,
  getImgUrl: propTypes.func,
  postMovieRating: propTypes.func,
};

export default SearchPage;
