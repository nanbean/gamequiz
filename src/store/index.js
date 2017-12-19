import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import gamequiz from '../reducers';

export default function configureStore (initialState) {
	const store = createStore(
		gamequiz,
		initialState,
		applyMiddleware(thunkMiddleware) // lets us dispatch functions
	);
	return store;
}
