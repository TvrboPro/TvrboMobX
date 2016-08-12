import React from 'react';
import { observer } from "mobx-react";
import Link from 'react-router/lib/Link';
import { translate } from 'react-i18next';

import Logo from 'widgets/Logo';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
// import Dropdown from 'react-bootstrap/lib/Dropdown';
// import MenuItem from 'react-bootstrap/lib/MenuItem';
// import { LinkContainer } from 'react-router-bootstrap';

@translate()
@observer(['main'])
class Header extends React.Component {
  render() {
    const t = this.props.t || (v => v);
    return (
      <div id="header">

        <Navbar fluid={true}>
          <div className="flex-nav">
            <Navbar.Header className="fix-flex">
              <Navbar.Brand>
                <Logo/>
              </Navbar.Brand>
              <Navbar.Toggle/>
            </Navbar.Header>

            <Navbar.Collapse className="fix-flex">
              <Nav className="nav-menu">
                <li>
                  <Link activeClassName="nav-active" to={this.props.main.prefix}>{t('Home')}</Link>
                </li>
                <li>
                  <Link activeClassName="nav-active" to={this.props.main.prefix + 'about'}>{t('About')}</Link>
                </li>
                <li>
                  <Link activeClassName="nav-active" to={this.props.main.prefix + 'faq'}>{t('FAQ')}</Link>
                </li>
              </Nav>
              <Nav pullRight>
                <NavItem eventKey={1} href="/">English</NavItem>
                <NavItem eventKey={2} href="/fr/">Français</NavItem>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>
      </div>
    );
  }
}
Header.propTypes = {
  main: React.PropTypes.object,
  t: React.PropTypes.func.isRequired
};

module.exports = Header;
