import React from 'react';
import { Flex, Box } from 'reflexbox';
import { translate } from 'react-i18next';

class Faq extends React.Component {
  static propTypes = {
    t: React.PropTypes.func
  };
  render() {
    const t = this.props.t || (v => v);

    return (
      <div id="faq">
        <Flex align="center" justify="space-between">
          <Box px={4}>
            <h1>{t('FAQ')}</h1>
            <p>{t('FAQ 1')}</p>
            <p>{t('FAQ 2')}</p>
            <p>{t('FAQ 3')}</p>
          </Box>
        </Flex>
        <Flex align="center" justify="space-between">
          <Box px={4}>
            <p>{t('Your content here')}</p>
          </Box>
        </Flex>
      </div>
    );
  }
}

module.exports = translate()(Faq);
