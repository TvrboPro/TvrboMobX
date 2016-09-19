import nodemailer from 'nodemailer';
import config from 'config';
import langConfig from 'config.lang';
import { gettextFromLang } from 'lib/locale'; // needs to be t() for strings to be parsed

const transporter = nodemailer.createTransport();

// MAIN

export function sendValidationEmail(recipientEmail, userId, validationToken, lang){
	let htmlContent, txtContent, URL, title;
	const t = message => gettextFromLang(message, lang); // needs to be t() for strings to be parsed

	// DETECT LANGUAGE
	switch(lang){
		case langConfig.DEFAULT_LANGUAGE:
			URL = `${config.SERVER_URL}/confirm/${userId}/${validationToken}`;
			break;
		default:
			URL = `${config.SERVER_URL}/${lang}/${t('confirm')}/${userId}/${validationToken}`;
	}

	title = t('Welcome');

	htmlContent = `<html><head><style> body { font-family: monospace; }</style></head><body>
	<p>${t('Bienvenido a Right Side Coffee')},</p>
	<p>${t('Para activar tu cuenta, haz click en')} <a href="${URL}">${t('este enlace')}</a>.</p>
	<p>${t('Si no funciona, copia el siguiente texto en la barra de dirección de tu navegador:')} <br/> <strong>${URL}</strong></p>
	<p>Right Side Coffee Roasters</p>
</body></html>`;

	txtContent = `${t('Bienvenido a Right Side Coffee')},

${t('Para activar tu cuenta, visita el siguiente enlace en tu navegador:')}
${URL}

Right Side Coffee Roasters`;

	sendEmail(recipientEmail, htmlContent, txtContent, title);
}

// AUX

function imgReplaceFunction(imgStr){
	 imgStr = imgStr.replace(/<img alt="[^"]*" src=(['"])/ig, '');
	 return {
		 filename: imgStr,
		 path: process.cwd() + '/media/' + imgStr,
		 cid: imgStr
	 }
}

// MAIN

const imagePattern = /<img alt="[^"]*" src=(['"])([a-z0-9\-\.]+)/ig;

export function sendEmail(recipientEmail, htmlContent, txtContent, title){
	if(!htmlContent) return;

	let params = {
		from: 'Right Side Coffee <info@rightsidecoffee.com>',
		to: recipientEmail,
		subject: title,
		text: txtContent,
		html: htmlContent
	};

	var contentImages = htmlContent.match(imagePattern);
	if(contentImages) {
		contentImages = contentImages.map(imgReplaceFunction);

		if(contentImages.length) {
			htmlContent = htmlContent.replace(/<img alt="([^"]*)" src=(['"])([a-z0-9\-\.]+)/ig, "<img alt=\"$1\" src=$2cid:$3");
			params.attachments = contentImages;
		}
	}

	transporter.sendMail(params);
}
