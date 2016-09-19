var mongoose = require('mongoose');

var schema = new mongoose.Schema({

	email: { type: String, required: true },
	validationToken: { type: String },
	password: { type: String },

	// info
	name: { type: String },
	lastName: String,

	registered : { type: Date, default: Date.now },
	lastSeen: Date
}, {
		collection: 'users'
});

module.exports = mongoose.model('User', schema);
