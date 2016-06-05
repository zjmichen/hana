import { ipcRenderer as ipc } from 'electron';

export const TRANSFORM = 'TRANSFORM';
export const SET_INPUT = 'SET_INPUT';
export const SET_INPUT_TYPE = 'SET_INPUT_TYPE';
export const SET_OUTPUT_TYPE = 'SET_OUTPUT_TYPE';
export const RESET = 'RESET';
export const ADD_PLUGIN = 'ADD_PLUGIN';
export const SET_PLUGINS = 'SET_PLUGINS';

export function transform(fromType, toType, data) {
  return (dispatch) => {
    ipc.on('transform', (event, data) => {
      dispatch({ type: TRANSFORM, data });
    });
    ipc.on('error', (event, error) => {
      throw new Error(error.message || error.code || error);
    });
    ipc.send('transform', {fromType, toType, data});
  };
}

export function setInput(input) {
  return { type: SET_INPUT, input };
}

export function setInputType(datatype) {
  return { type: SET_INPUT_TYPE, datatype };
}

export function setOutputType(datatype) {
  return { type: SET_OUTPUT_TYPE, datatype };
}

export function reset(state) {
  return { type: RESET, state };
}

export function addPlugin(plugin) {
  return { type: ADD_PLUGIN, plugin };
}

export function setPlugins(plugins) {
  return { type: SET_PLUGINS, plugins };
}