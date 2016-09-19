// ALLOW TRANSLATION IN-PLACE (SERVER SIDE)

import i18n from 'i18next';

export function gettextFromLang(message, lang){
	if(!message) return "";
	else if(!lang) {
		console.error("WARNING: No 'lang' supplied in gettextFromRequest (" + message + ")");
		return message;
	}

	i18n.changeLanguage(lang);
	i18n.translate = i18n.t; // hack to avoid the t parser here
	return i18n.translate(message);
}

export function gettextFromRequest(message, req){
	if(!message) return "";
	else if(!req) {
		console.error("WARNING: No 'req' supplied in gettextFromRequest (" + message + ")");
		return message;
	}
	else if(!req.cookies || !req.cookies.lang) {
		console.error("WARNING: No lang supplied in cookie from gettextFromRequest (" + message + ")");
		return message;
	}

	i18n.changeLanguage(req.cookies.lang);
	i18n.translate = i18n.t; // hack to avoid the t parser here
	return i18n.translate(message);
}
