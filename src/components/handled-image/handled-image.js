import * as propTypes from 'prop-types';
import { Component } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import StubPicture from 'components/stub-picture';
import Image from 'components/image';

import './handled-image.css';

function handledImage(View, ViewGag) {
  class HandledImage extends Component {
    state = { error: false, loading: true };

    handleLoad = () => {
      this.setState(() => ({ error: false, loading: false }));
    };

    handleError = () => {
      this.setState(() => ({ error: true, loading: false }));
    };

    render() {
      const { src, alt, className } = this.props;
      const { error, loading } = this.state;

      const spin = <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} />} />;

      return (
        <>
          {!error && loading && spin}
          {error && !loading && <ViewGag />}
          <View
            className={className}
            src={src}
            alt={alt}
            onError={this.handleError}
            onLoad={this.handleLoad}
            style={{ display: error || loading ? 'none' : 'initial' }}
          />
        </>
      );
    }
  }

  HandledImage.defaultProps = {
    alt: '',
    src: '',
    className: '',
  };
  HandledImage.propTypes = {
    src: propTypes.string,
    alt: propTypes.string,
    className: propTypes.string,
  };
  return HandledImage;
}

export default handledImage(Image, StubPicture);
