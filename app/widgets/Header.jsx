import React from 'react';
import Link from 'react-router/lib/Link';
import { observer } from "mobx-react";
import { Flex, Box } from 'reflexbox';
import { translate } from 'react-i18next';

@translate()
@observer(['main'])
class Header extends React.Component {
  static propTypes = {
    main: React.PropTypes.object,
    t: React.PropTypes.func
  }

  render() {
    const t = this.props.t || (v => v);
    return (
      <div id="header">
        <Flex align="center" justify="space-between">
          <Box auto p={3}>
            <Link activeClassName="nav-active" to={this.props.main.prefix}>{t('Home')}</Link>
          </Box>
          <Box p={3}>
            <Link activeClassName="nav-active" to={this.props.main.prefix + 'about'}>{t('About')}</Link>
          </Box>
          <Box p={3}>
            <Link activeClassName="nav-active" to={this.props.main.prefix + 'faq'}>{t('FAQ')}</Link>
          </Box>
        </Flex>
      </div>
    );
  }
}

module.exports = Header;
