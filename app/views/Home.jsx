import React from 'react';
import Link from 'react-router/lib/Link';
import { observer } from "mobx-react";
import { translate } from 'react-i18next';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

@translate()
@observer(['main'])
class Home extends React.Component {

  inc() {
    this.props.main.counter++;
  }

  render() {
    const t = this.props.t || (v => v);

    return (
      <div id="home">
        <Grid fluid >
          <Row>
            <Col xs={12} md={6}>
              <div className="text-center">
                <h1 className="font--mamut">
                  <Link to={this.props.main.prefix + 'about'}>
                    {t('About')}
                  </Link>
                </h1>
              </div>
            </Col>

            <Col xs={12} md={6}>
              <div className="text-center">
                <h1 className="font--mamut">
                  <Link to={this.props.main.prefix + 'faq'}>
                    {t('FAQ')}
                  </Link>
                </h1>
              </div>
            </Col>
          </Row>

          <Row className="gutter-0">
            <Col xs={12} className="text-center">
              <p>{t('Counter: ')} {this.props.main.counter}</p>
              <p style={ {cursor: 'pointer'} } onClick={this.inc.bind(this)}>{t('Click to increment')}</p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
Home.propTypes = {
  main: React.PropTypes.object.isRequired,
  t: React.PropTypes.func.isRequired
};

module.exports = Home;
