import React from 'react';
import { observer } from "mobx-react";
import Link from 'react-router/lib/Link';

@observer(['main'])
class Logo extends React.Component {
  render() {
    return (
      <div id="logo">
        <Link to={this.props.main.prefix}>
          {/*<img src="/media/logo-m.svg" className="logo-m hidden-md hidden-lg" />*/}
        </Link>
        <Link to={this.props.main.prefix}>
          {/*<img src="/media/logo.svg" className="logo hidden-xs hidden-sm" />*/}
        </Link>
      </div>
    );
  }
}

Logo.wrappedComponent.propTypes = {
  main: React.PropTypes.object
};

module.exports = Logo;
