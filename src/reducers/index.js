import {
  TRANSFORM,
  SET_ERROR,
  SET_INPUT, 
  SET_INPUT_TYPE, 
  SET_OUTPUT_TYPE, 
  RESET,
  ADD_PLUGIN, 
  SET_PLUGINS 
} from '../actions';

export default (state, action) => {
  switch(action.type) {
  case SET_INPUT:
    return {
      ...state,
      input: action.input
    };
  
  case TRANSFORM:
    return {
      ...state,
      output: {
        ...state.output,
        data: action.data
      },
      transformError: ''
    };

  case SET_ERROR:
    return {
      ...state,
      transformError: action.error
    };
  
  case SET_INPUT_TYPE:
    return {
      ...state,
      input: {
        ...state.input,
        type: action.datatype
      }
    };
  
  case SET_OUTPUT_TYPE:
    return {
      ...state,
      output: {
        ...state.output,
        type: action.datatype
      }
    };
  
  case RESET:
    return action.state;
  
  case ADD_PLUGIN:
    return {
      ...state,
      plugins: [
        ...state.plugins,
        action.plugin
      ]
    };
  
  case SET_PLUGINS:
    return {
      ...state,
      plugins: action.plugins
    };

  default:
    return state;
  }
};