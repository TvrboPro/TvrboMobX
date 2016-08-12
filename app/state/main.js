import { observable, action } from 'mobx';
import config from 'config.lang';

export default class MainState {
  // fields
  @observable lang = '';
  @observable prefix = '/';
  @observable counter = 0;

  serialize() {
    return {
      lang: this.lang,
      prefix: this.prefix,
      counter: this.counter
    };
  }

  constructor(initialState) {
    if(initialState && typeof initialState == 'object'){
      Object.assign(this, initialState);
    }
  }

  @action
  setLanguage(lang) {
    if(lang == config.DEFAULT_LANGUAGE) {
      this.lang = lang;
      this.prefix = '/';
      return;
    }

    for(let i = 0; i < config.SUPPORTED_LANGUAGES.length; i++) {
      if(config.SUPPORTED_LANGUAGES[i].code == lang) {
        this.lang = lang;
        this.prefix = `/${lang}/`;
        return;
      }
    }
    this.lang = config.DEFAULT_LANGUAGE;
    this.prefix = '/';
  }
}
