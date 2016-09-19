import React from 'react';
import { observer } from "mobx-react";
import { Button } from 'rebass'
import { Flex, Box } from 'reflexbox';
import { translate } from 'react-i18next';
import Alert from 'react-s-alert';

@translate()
@observer(['main'])
class Home extends React.Component {
  static propTypes = {
    t: React.PropTypes.func.isRequired,
    main: React.PropTypes.object.isRequired
  };

  constructor(props){
    super(props);

    this.inc = this.inc.bind(this);
    this.showAlert = this.showAlert.bind(this);
  }

  inc() {
    this.props.main.counter++;
  }
  showAlert() {
    const t = this.props.t || (v => v);

    Alert.warning(t("This is a warning"))
  }

  render() {
    const t = this.props.t || (v => v);

    return (
      <div id="home">

        <Flex align="center" justify="space-around">
          <Box p={4}>
            <h3>{t('Counter: ')} {this.props.main.counter}</h3>
          </Box>
        </Flex>
        <Flex align="center" justify="space-around">
          <Box py={4} col={4}>
            <Button big={true} backgroundColor="primary" color="white" inverted rounded onClick={this.inc}> {t('Click to increment')} </Button>
          </Box>
          <Box py={4} col={4}>
            <Button big={true} backgroundColor="warning" color="white" inverted rounded onClick={this.showAlert}> {t('Click to show an alert')} </Button>
          </Box>
        </Flex>

      </div>
    );
  }
}

module.exports = Home;
