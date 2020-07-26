import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import createSagaMiddleware from "redux-saga";
import rootSaga from "store/sagas";
import reducer from "store/reducer";

const middleWare = [];

const sagaMiddleware = createSagaMiddleware();
middleWare.push(sagaMiddleware);

const loggerMiddleware = createLogger({
	"predicate": () => process.env.NODE_ENV === "development"
});
middleWare.push(loggerMiddleware);

const createStoreWithMiddleware = composeWithDevTools(applyMiddleware(...middleWare))(createStore);

const makeStore = initialState => {
	const store = createStoreWithMiddleware(reducer, initialState);

	store.runSagaTask = () => {
		store.sagaTask = sagaMiddleware.run(rootSaga);
	};
	store.runSagaTask();

	return store;
};

export default makeStore;
