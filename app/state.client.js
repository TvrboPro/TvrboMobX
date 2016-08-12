import MainState from 'state/main';

export function rehydrate(initialState){
	var state = {
		main: new MainState(initialState.main)

		// more stores here
	};

	return state;
}
