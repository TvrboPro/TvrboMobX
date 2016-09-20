import config from 'config';
import langConfig from 'config.lang';
import express from 'express';
import serveStatic from 'serve-static';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';

import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import RouterContext from 'react-router/lib/RouterContext';
import match from 'react-router/lib/match';
import { Provider } from 'mobx-react';
import i18n from 'i18next';
import I18nextProvider from 'react-i18next/dist/commonjs/I18nextProvider';
import locales from 'locales';

import routes from 'routes';
import apiRouter from 'api';

import { makeInitialState, dehydrate } from 'state.server';

// BUNDLE SERVED FROM MEMORY
var cssBundle = "";
const sassBundleFileName = path.join(__dirname, '..', 'public', 'bundle-sass.css');

function refreshCssBundle() {
  if(fs.existsSync(sassBundleFileName)) {
    cssBundle = fs.readFileSync(sassBundleFileName).toString();
  }
}

if(!config.DEBUG) {
  // EMBEDED FRESH CSS BUNDLE FOR PRODUCTION
  setInterval(refreshCssBundle, 1000 * 60);
  refreshCssBundle();

  if(!cssBundle)
    console.error("ERROR: The CSS bundle files are not present.\n" +
                  "       Make sure you build the app before you run the server with \"npm run build\"\n");
}

// LOCALIZATION
i18n.init({
  fallbackLng: false,
  returnEmptyString: false,
  keySeparator: false,
  nsSeparator: false,
  resources: locales
}, function(err) {
  if(err) console.error("i18n init ERROR:", err);
});

// SERVER LOGIC
var app = express();

// Uncoment to enforce https:// behind a proxy

// if(!config.DEBUG) {
//   app.use('/*', function(req, res, next){
//     if(req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https'){
//       res.redirect(301, 'https://' + req.get('Host') + req.url);
//     }
//     next();
//   });
// }

if(config.ALLOW_CORS) {
    app.use(function(req, res, next){
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
    });
}

// FAVICON
app.use(favicon(path.join(__dirname, 'media', 'favicon.ico')));

// HTTP AUTH?
if(config.HTTP_USER && config.HTTP_PASSWORD) {
    app.use(express.basicAuth(config.HTTP_USER, config.HTTP_PASSWORD));
    console.log((new Date()).toJSON() + " | " + config.APP_NAME + " using HTTP Auth", "\n");
}

// STATIC FILES
app.use(serveStatic(path.join(__dirname, '..', 'public')));

app.use(cookieParser());
app.use(apiRouter);

// RENDER THE MAIN PAGE

app.use(function mainPageRender(req, res){
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if(err) handleError(res, err);
    else if(redirectLocation) handleRedirect(res, redirectLocation);
    else if(renderProps) handleMainPageRouter(req, res, renderProps);
    else handleNotFound(res);
  });
});


// HELPER FUNCTIONS
function handleMainPageRouter(req, res, renderProps){
  // Language detection
  let requestLanguage = langConfig.DEFAULT_LANGUAGE;
  if(renderProps.params && renderProps.params.lang) {
    for(let i = 0; i < langConfig.SUPPORTED_LANGUAGES.length; i++) {
      if(langConfig.SUPPORTED_LANGUAGES[i].code == renderProps.params.lang) {
        requestLanguage = renderProps.params.lang
        break; // found it
      }
    }
  }
  res.cookie('lang', requestLanguage, { httpOnly: true, secure: !config.DEBUG });

  makeInitialState({
    language: requestLanguage,
    userId: req.cookies && req.cookies.userId
  })
  .then(state => res.send(renderView(renderProps, state)) )
  .catch(err => {
    console.log("SERVER RENDER ERROR:", err);
    res.status(500).send(err.message);
  });
}

function handleRedirect(res, redirect) {
  res.redirect(302, redirect.pathname + redirect.search);
}

function handleNotFound(res) {
  res.status(404).send('Not Found');
}

function handleError(res, err) {
  res.status(500).send(err.message);
}

function renderView(renderProps, state) {
    i18n.changeLanguage(state.main.lang);

    const componentHTML = renderToString(
        <I18nextProvider i18n={ i18n }>
          <Provider {...state}>
            <RouterContext {...renderProps} />
          </Provider>
        </I18nextProvider>
    );

    const initialState = dehydrate(state);

    if(config.DEBUG){
      // DEBUG: The bundle is served separately
      //        The initial FOUC is hidden
      return `
          <!DOCTYPE html>
          <html>
              <head>
                  <meta charset="utf-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1">

                  <title>${config.HTML_TITLE}</title>
                  <style>
                  .skip-fouc {
                      opacity: 0;
                  }
                  </style>

                  <script>
                      window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
                  </script>
              </head>
              <body>
                <div id="app" class="skip-fouc">${componentHTML}</div>
                <script src="/bundle.js"></script>
                <script>
                  document.getElementById('app').className = "";
                </script>
              </body>
          </html>
      `;
    }
    else {
      return `
          <!DOCTYPE html>
          <html>
              <head>
                  <meta charset="utf-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1">

                  <title>${config.HTML_TITLE}</title>
                  <style>
                    ${cssBundle}
                  </style>
                  <script>
                      window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
                  </script>
              </head>
              <body>
                  <div id="app">${componentHTML}</div>
                  <script src="/bundle.js"></script>
              </body>
          </html>
      `;
    }
}

module.exports = app;
