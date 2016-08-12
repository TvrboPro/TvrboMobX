import Promise from 'bluebird';
import config from 'config';

import MainState from 'state/main';

var preparedContents = {
	// ...
};

export function makeInitialState(params){
	var state = {};

	return Promise.try(() => {
		// Sync operations

		state.main = new MainState({});
		state.main.counter = 10;
		state.main.setLanguage(params.language);

		if(config.DEBUG) return refreshPreparedContents(true); // force refresh
	})
	.then(() => {
		// Your Prepared Data

		// 	state.main.products = preparedContents.products;

		// Async DB operations

		// 	let proms = [];
		// 	if(params.userId) {
		// 		proms.push(Customer.findById(params.userId).select('name lastName email phone company type requestedWholesale billing delivery').exec()
		// 			.then(function(user){
		// 				state.main.user = user;
		// 			})
		// 			.catch(function(){
		// 				state.main.user = {};
		// 			})
		// 		);
		// 	}

		// 	return Promise.all(proms);
	})
	.then(() => {
		return state;
	});
}

export function dehydrate(state){
	var result = {};
	Object.keys(state).forEach(k => {
		if(state[k].toJson)
			result[k] = state[k].serialize();
		else
			result[k] = state[k];
	});
	return result;
}

// HELPER

var refreshing = false;

function refreshPreparedContents(force){
	if(!force && refreshing) return;
	else refreshing = true;

	var proms = [];

	// Fetch your prepared contents for server side initial state here

	// proms.push(User.find().lean().exec()
	// 	.then(function(users){
	// 		if(!users || !users[0]) return;
	// 		preparedContents.user = users[0];
	// 	})
	// );

	return Promise.all(proms)
	.then(function(){
		refreshing = false;
	})
	.catch(function(err){
		refreshing = false;
		console.error("Error refreshing default content\n", err);
	});
}

setInterval(refreshPreparedContents, 1000 * 30);
refreshPreparedContents();

