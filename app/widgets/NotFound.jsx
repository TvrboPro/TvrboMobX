import React from 'react';
import { Flex, Box } from 'reflexbox';
import { translate } from 'react-i18next';

@translate()
class NotFound extends React.Component {
  static propTypes = {
    message: React.PropTypes.string,
    t: React.PropTypes.func
  };

  render() {
    const t = this.props.t || (v => v);
    return (
      <div>
        <Flex align="center" justify="space-between">
          <Box auto px={4}>
            <h1>{t('Not found')}</h1>
            <p>{t('The page your are looking for does not exist :(')}</p>
          </Box>
        </Flex>
      </div>
    );
  }
}

module.exports = NotFound;
