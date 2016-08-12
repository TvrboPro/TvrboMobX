var config = require('../config.lang');

// Exported object will be like:
//
// {
//   en: {translation: { ... }}
//   fr: {translation: { ... }}
// };

module.exports = config.SUPPORTED_LANGUAGES.reduce(function(locales, lang){
  try {
    locales[lang.code] = {translation: require('./' + lang.code + '/translation.json')};
  }
  catch(e) {
    console.error("ERROR: The translation file is not available for", lang.name, "\nMake sure that you have generated the language templates by running \"npm run po:extract\"\n");
  }

  return locales;
}, {});
