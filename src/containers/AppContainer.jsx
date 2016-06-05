import { connect } from 'react-redux';
import { transform, setInput, setInputType, setOutputType, addPlugin } from '../actions';
import App from '../components/App';
import { ipcRenderer as ipc } from 'electron';

const mapStateToProps = (state) => {
  const inputPlugin = state.plugins.find(
    (plugin) => plugin.type === state.input.type);
  const outputTypes = (inputPlugin) ? inputPlugin.outputTypes : [];

  return {
    input: state.input,
    output: state.output,
    plugins: state.plugins,
    outputTypes: outputTypes,
    errorMsg: state.transformError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    transform: (from, to, data) => dispatch(transform(from, to, data)),
    setInput: (input) => dispatch(setInput(input)),
    setInputType: (type) => dispatch(setInputType(type)),
    setOutputType: (type) => dispatch(setOutputType(type)),
    addPlugin: () => {
      ipc.on('addplugin', (event, plugin) => {
        dispatch(addPlugin(plugin));
      });
      ipc.send('addplugin');
    },
    createPlugin: () => {
      ipc.on('createplugin', (event, plugin) => {
        console.log(plugin);
        dispatch(addPlugin(plugin));
      });
      ipc.send('createplugin');
    }
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
export default AppContainer;