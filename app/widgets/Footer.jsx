import React from 'react';
import { observer } from "mobx-react";
import { translate } from 'react-i18next';

import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

@translate()
@observer(['main'])
class Footer extends React.Component {
  render() {
    const t = this.props.t || (v => v);
    return (
      <footer id="footer">
        <br/>
        <Grid>
          <Row>
            <Col xs={12} className="text-center">
              {/*<img src="/media/footer-m.svg" className=" hidden-md hidden-lg" />*/}
              {/*<img src="/media/footer.svg" className="hidden-xs hidden-sm" />*/}
              <div className="text-center">
                <p> <strong className="text-uppercase font-bold"> Tvrbo.pro</strong> &ndash; {t('Some rights might eventually be reserved. Or not.')} </p>
              </div>
            </Col>
          </Row>
        </Grid>
      </footer>
    );
  }
}

Footer.propTypes = {
  main: React.PropTypes.object,
  t: React.PropTypes.func
};

module.exports = Footer;
