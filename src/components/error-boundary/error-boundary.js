import { Component } from 'react';
import { Alert } from 'antd';
import * as propTypes from 'prop-types';

class ErrorBoundary extends Component {
  state = { hasError: false };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    return hasError ? (
      <Alert type="error" message="Ошибка в компоненте." description="Мы уже работаем над этим." showIcon closable />
    ) : (
      children
    );
  }
}
ErrorBoundary.defaultProps = {
  children: '',
};
ErrorBoundary.propTypes = {
  children: propTypes.node,
};
export default ErrorBoundary;
