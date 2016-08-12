import React from 'react';
import { translate } from 'react-i18next';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

@translate()
class About extends React.Component {
  render() {
    const t = this.props.t || (v => v);

    return (
      <div id="about">
        <div className="text-center">
          <h1>{t('About')}</h1>
        </div>
        <Grid>
          <Row>
            <Col className="text-center" md={12}>{t('Your content here')}</Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
About.propTypes = {
  t: React.PropTypes.func
};

module.exports = About;
