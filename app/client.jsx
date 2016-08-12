import langConfig from 'config.lang';
import React from 'react';
import { render } from 'react-dom';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import routes from 'routes';
import { Provider } from 'mobx-react';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import I18nextProvider from 'react-i18next/dist/commonjs/I18nextProvider';
import locales from './locales';

import { rehydrate } from 'state.client';

// STYLES
import 'bootstrap/less/bootstrap.less';
import 'styles/master.scss';


function restoreLocalState(state){
  // restore your stored state in the local storage
}

// CONTENT

function initialRender(){

  const state = rehydrate(window.__INITIAL_STATE__);

  // TODO: UNIFIED BEHAVIOR WITH SERVER

  var urlHasLanguage = false;
  for(let i = 0; i < langConfig.SUPPORTED_LANGUAGES.length; i++) {
    if(location.pathname.indexOf(`/${langConfig.SUPPORTED_LANGUAGES[i].code}/`) < 0) continue;

    urlHasLanguage = true;
    i18n.init({
      lng: langConfig.SUPPORTED_LANGUAGES[i].code,
      fallbackLng: false,
      returnEmptyString: false,
      keySeparator: false,
      nsSeparator: false,
      resources: locales
    });
  }

  if(!urlHasLanguage) {
    i18n.use(LanguageDetector)
    .init({
      fallbackLng: false,
      returnEmptyString: false,
      keySeparator: false,
      nsSeparator: false,
      resources: locales
    });
  }

  const reactApp = (
    <I18nextProvider i18n={ i18n }>
      <Provider {...state}>
        <Router children={ routes } history={ browserHistory } onUpdate={() => window.scrollTo(0, 0)} />
      </Provider>
    </I18nextProvider>
  );
  render(reactApp, document.getElementById('app'));

  // Dispatch *after* the server generated state has been consumed
  restoreLocalState(state);
}


// INIT
initialRender();
