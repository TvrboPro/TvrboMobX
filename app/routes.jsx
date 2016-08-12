import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';

import App from 'views/App';
import NotFound from 'views/NotFound';

import Home from 'views/Home';

import About from 'views/About';
import Faq from 'views/Faq';


// PUT NEW ROUTES BELOW

const appRoutes = (
  <Route component={App}>
    <IndexRoute component={Home} />

    <Route path="about" component={About}/>
    <Route path="faq" component={Faq}/>
  </Route>
);


module.exports = (
  <Route path="/">

    <Route path=":lang/">
      {appRoutes}
    </Route>

    {appRoutes}
    <Route path="*" component={NotFound} />
  </Route>
);
