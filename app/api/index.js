var express = require('express');
import bodyParser from 'body-parser';

// IMPORT HANDLERS
import userApiRoutes from './user';
import productApiRoutes from './product';

// ROUTER
var router = express.Router();
router.use('/api', bodyParser.json({limit: '10mb'}));

// DECLARE ROUTES
router.use('/api', userApiRoutes);
router.use('/api', productApiRoutes);


// EXPORT
module.exports = router;
