import React from 'react';
import { render } from 'react-dom';
import AppContainer from './containers/AppContainer';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { ipcRenderer as ipc } from 'electron';
import reducers from './reducers';
import { reset, setPlugins } from './actions';
import cache from './lib/cache';
import initialState from './initialState';

let store = createStore(reducers, initialState, applyMiddleware(thunk));
if (store.getState().settings.hotExit) {
  store.dispatch(reset(cache.patchState(store.getState())));
  cache.enableHotExit(store);
} else {
  cache.clear();
}

ipc.on('getplugins', (event, plugins) => {
  store.dispatch(setPlugins(plugins));
});
ipc.send('getplugins');

document.addEventListener('DOMContentLoaded', () => {
  render((
    <Provider store={store}>
      <AppContainer />
    </Provider>
  ), document.getElementById('root'));
});