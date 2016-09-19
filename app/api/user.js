import config from 'config';
import langConfig from 'config.lang';
import express from 'express';
import User from 'models/user';
import { digestPwd } from 'lib/util';
import { sendValidationEmail } from 'lib/mailing';
import { gettextFromRequest } from 'lib/locale'; // needs to be t() for strings to be parsed

// ROUTER
const router = express.Router();

function checkLoggedUser(req, res, next){ /* TODO */ next();}

// API DEFINITIONS
router.get('/auth', [ checkLoggedUser, getAccount ]);
router.get('/users/logout', [ logout ]);
router.post('/users/login', [ loginUser ]);
router.post('/users/confirm', [ confirmUser ]);
router.put('/users/:id', [ updateUser ]);
router.put('/users/:id/password', [ setPassword ]);
router.post('/users', [ signUp ]);
router.delete('/users/:id', [ checkLoggedUser, removeAccount ]);


function getAccount(req, res){
	const t = message => gettextFromRequest(message, req);

	User.findById(req.cookies.userId).select('name lastName email').exec()
	.then(function(user){
		if(!user) return res.status(404).send({error: t('El usuario no existe')});
		res.send(user);
	})
	.catch(function(err){
		res.status(500).send({error: t('No se ha podido cargar el usuario'), err: err});
	});
}

function loginUser(req, res){
	const t = message => gettextFromRequest(message, req);

	if(!req.body.email || !req.body.password) return res.status(404).send({error: t("El email o la contraseña no son válidos")});

	User.findOne({email: req.body.email}).lean().exec()
	.then(function(user){
		if(!user)
			return res.status(404).send({error: t("El email o la contraseña no son válidos")});
		else if(user.validationToken)
			return res.status(406).send({error: t("Antes de continuar, debes completar la activación de tu cuenta")});
		else if(user.password != digestPwd(req.body.password))
			res.status(404).send({error: t("El email o la contraseña no son válidos")});
		else {
			res.cookie('userId', user._id, { httpOnly: true, secure: !config.DEBUG });
			res.send({
				_id: user._id,
				name: user.name,
				lastName: user.lastName,
				email: user.email
			});
		}
	})
	.catch(function(err){
		return res.status(500).send({error: t('No se ha podido cargar el usuario'), err: err});
	});
}

function logout(req, res){
	res.clearCookie("userId");
	res.send('');
}

function signUp(req, res){
	const t = message => gettextFromRequest(message, req);

	if(!req.body.email) return res.status(406).send({error: t("Introduce un email para continuar")});

	User.findOne({email: req.body.email}).exec()
	.then(function(user){
		if(user && user.email && !user.validationToken) throw 'already';
		else if(user && user.email) {
			return user;
		}
		var newCustomer = {
			email: req.body.email,
			validationToken: digestPwd(Date.now()+'//RSC')
		};

		return User.create(newCustomer);
	})
	.then(function(user){
		sendValidationEmail(user.email, user._id, user.validationToken, req.body.lang || langConfig.DEFAULT_LANGUAGE);

		res.send({
			_id: user._id,
			email: user.email
		});
	})
	.catch(function(err){
		if(err == 'already') return res.status(406).send({error: t("Ya tienes una cuenta activa en Right Side Coffee")});
		return res.status(500).send({error: t('No se ha podido crear la cuenta'), err: err});
	});
}

function confirmUser(req, res){
	const t = message => gettextFromRequest(message, req);

	if(!req.body.userId || !req.body.code) return res.status(406).send({error: t("Ha ocurrido un error con la petición")});

	User.findById(req.body.userId).lean().exec()
	.then(function(user){
		if(!user) {
			return res.status(404).send({error: t("El usuario no existe")});
		}
		// JUST CHECK THAT IT IS OK
		// Registration will be completed when the password is set
		else if(user.validationToken && req.body.code == user.validationToken) {
			return res.send({
				_id: user._id,
				email: user.email
			});
		}
		else if(user.validationToken && req.body.code != user.validationToken)
			res.status(406).send({error: t("La validación no es correcta")});
		else if(!user.validationToken)
			res.status(406).send({error: t("Esta cuenta ya ha sido activada")});
		else
			res.status(406).send({error: t("Ha ocurrido un error con la validación")});
	})
	.catch(function(err){
		return res.status(500).send({error: t('No se ha podido verificar la cuenta'), err: err});
	});
}

function updateUser(req, res){
	const t = message => gettextFromRequest(message, req);

	if(!req.params.id) return res.status(404).send({error: t("El usuario no existe")});
	var updates = {};
	updates.company = req.body.company;

	if(req.body.name) updates.name = req.body.name;
	if(req.body.lastName) updates.lastName = req.body.lastName;
	if(req.body.phone) updates.phone = req.body.phone;

	User.findByIdAndUpdate(req.params.id, updates).exec()
	.then(function(user){
		if(!user) return res.status(404).send({error: t("El usuario no existe")});
		res.send('');
	})
	.catch(function(err){
		return res.status(500).send({error: t('No se han podido actualizar los datos'), err: err});
	});
}

function setPassword(req, res){
	const t = message => gettextFromRequest(message, req);

	if(!req.params.id) return res.status(404).send({error: t("El usuario no existe")});
	else if(!req.body.password) return res.status(406).send({error: t("Los parámetros no son válidos")});

	User.findById(req.params.id).exec()
	.then(function(user){
		if(!user)
			return res.status(404).send({error: t("El usuario no existe")});
		else if(user.password) {
			// TODO?  CHANGE PASSWORD
			if(!req.body.oldPassword)
				return res.status(406).send({error: t("Los parámetros no son válidos")});
			else if(digestPwd(req.body.oldPassword) != user.password)
				return res.status(406).send({error: t("La contraseña es inválida")});

			return User.findByIdAndUpdate(user._id, {$unset: {validationToken: ""}, password: digestPwd(req.body.password), lastSeen: new Date()}).exec()
			.then(function(){
				res.cookie('userId', user._id, { httpOnly: true, secure: !config.DEBUG });
				return res.send({
					_id: user._id,
					name: user.name,
					lastName: user.lastName,
					email: user.email
				});
			});
		}
		else if(!user.password && user.validationToken) {
			// FIRST PASSWORD SET

			if(req.body.code != user.validationToken)
				return res.status(406).send({error: t("La validación no es correcta")});

			return User.findByIdAndUpdate(user._id, {$unset: {validationToken: ""}, password: digestPwd(req.body.password), lastSeen: new Date()}).exec()
			.then(function(){
				res.cookie('userId', user._id, { httpOnly: true, secure: !config.DEBUG });
				return res.send({
					_id: user._id,
					name: user.name,
					lastName: user.lastName,
					email: user.email
				});
			});
		}
		else
			res.status(404).send({error: t("Ha ocurrido un error con la petición")});
	})
	.catch(function(err){
		return res.status(500).send({error: t('No se ha podido cambiar la contraseña'), err: err});
	});
}

function removeAccount(req, res){
	const t = message => gettextFromRequest(message, req);

	if(!req.params.id || !req.cookies.userId || req.params.id != req.cookies.userId)
		return res.status(401).send({error: t("No se puede completar la acción")});

	User.findById(req.params.id).lean().exec()
	.then(user => {
		if(!user) return res.status(404).send({error: t("El usuario no existe")});

		return User.findByIdAndRemove(req.params.id).lean().exec()
		.then(() => res.send({}) );
	})
	.catch(err => res.status(505).send({error: err.message || err}) );
}

module.exports = router;
