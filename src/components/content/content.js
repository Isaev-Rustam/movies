import './content.css';
import classNames from 'classnames';
import * as propTypes from 'prop-types';

function Content({ children, loading, error }) {
  return (
    <div className={classNames('content', { 'content-loader': loading }, { 'content-error': error })}> {children}</div>
  );
}
Content.defaultProps = {
  loading: false,
  error: false,
  children: '',
};
Content.propTypes = {
  children: propTypes.node,
  loading: propTypes.bool,
  error: propTypes.bool,
};
export default Content;
