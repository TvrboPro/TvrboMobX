import React from 'react';

import Header from 'widgets/Header';
import Footer from 'widgets/Footer';
import NotFoundWidget from 'widgets/NotFound';

class NotFound extends React.Component {
  render() {
    return (
      <div>
        <Header {...this.props}/>
        <NotFoundWidget/>
        <Footer {...this.props}/>
      </div>
    );
  }
}

module.exports = NotFound;
