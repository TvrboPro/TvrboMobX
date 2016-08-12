import React from 'react';
import { translate } from 'react-i18next';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

@translate()
class NotFound extends React.Component {
  render() {
    const t = this.props.t || (v => v);
    return (
      <Grid id="notfound">
        <Row>
          <Col md={8} mdOffset={2} className="text-center ">
            <h1>{t('Not found')}</h1>
            <p>{t('The page your are looking for does not exist :(')}</p>
          </Col>
        </Row>
      </Grid>
    );
  }
}

NotFound.propTypes = {
  message: React.PropTypes.string,
  t: React.PropTypes.func
};

module.exports = NotFound;
