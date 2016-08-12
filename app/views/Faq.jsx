import React from 'react';
import { translate } from 'react-i18next';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class Faq extends React.Component {
  render() {
    const t = this.props.t || (v => v);

    return (
      <div id="faq">
        <Grid >
          <Row>
            <Col xs={12} className="text-center">
              <h1>{t('FAQ')}</h1>
              <p>{t('FAQ 1')}</p>
              <p>{t('FAQ 2')}</p>
              <p>{t('FAQ 3')}</p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Faq.propTypes = {
  t: React.PropTypes.func
};

module.exports = translate()(Faq);
