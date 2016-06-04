import { TRANSFORM, SET_INPUT, SET_INPUT_TYPE, SET_OUTPUT_TYPE, RESET } from '../actions';

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
      }
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
  default:
    return state;
  }
};