var mongoose = require('mongoose');

var newSchema = new mongoose.Schema({

	name: String,
	slug: String,   // URL name
	description: String,

	price: { type: Number, default: 0 },

	weight: { type: Number, default: 0 }

}, {
		collection: 'products'
});

module.exports = mongoose.model('Product', newSchema);

