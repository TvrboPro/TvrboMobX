import express from 'express';
import { gettextFromRequest as t} from 'lib/locale'; // needs to be t() for strings to be parsed
import Product from 'models/product';

// ROUTER
const router = express.Router();

// API DEFINITIONS
router.get('/products', [ getProducts ]);

// API ROUTINES

function getProducts(req, res){
	Product.find().lean().exec()
	.then(function(products){
		res.send(products);
	})
	.catch(function(err){
		return res.status(500).send({error: t('Could not retrieve the products', req), err: err});
	});
}

module.exports = router;
