import { connect } from 'react-redux';
import { transform, setInput, setInputType, setOutputType } from '../actions';
import App from '../components/App';

const mapStateToProps = (state) => {
  return {
    input: state.input,
    output: state.output
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    transform: (from, to, data) => dispatch(transform(from, to, data)),
    setInput: (input) => dispatch(setInput(input)),
    setInputType: (type) => dispatch(setInputType(type)),
    setOutputType: (type) => dispatch(setOutputType(type))
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;