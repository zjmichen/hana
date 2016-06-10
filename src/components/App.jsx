import React, { PropTypes } from 'react';
import TransformView from './TransformView';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import '../style/app-layout.less';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.chooseFile = this.chooseFile.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.transform = this.transform.bind(this);
    this.addPlugin = this.addPlugin.bind(this);
    this.createPlugin = this.createPlugin.bind(this);
  }

  chooseFile() {
    let that = this;

    ipcRenderer.on('choosefile', (event, files) => {
      if (!files) return;
      if (files.length === 0) return;
      that.loadFile(files[0]);
    });
    ipcRenderer.send('choosefile');
  }

  loadFile(filename) {
    fs.readFile(filename, 'utf-8', (err, data) => {
      this.props.setInput({
        name: filename,
        type: filename.split('.').pop(),
        data
      });
    });
  }

  addPlugin() {
    this.props.addPlugin();
  }

  createPlugin() {
    this.props.createPlugin();
  }

  updateInput(event) {
    this.props.setInput({
      ...this.props.input,
      data: event.target.value
    });
  }

  transform() {
    this.props.transform(this.props.input.type, this.props.output.type, this.props.input.data);
  }

  render() {
    return (
      <div className='app-layout'>
        <div className='tool-bar'>
          <button className='tool-button' onClick={this.chooseFile}>
            <i className='icon fa fa-folder-open'></i>
            <span className='label'>Load file</span>
          </button>
          <button className='tool-button' onClick={this.addPlugin}>
            <i className='icon fa fa-plus-square-o'></i>
            <span className='label'>Import plugin</span>
          </button>
          <button className='tool-button' onClick={this.createPlugin}>
            <i className='icon fa fa-code'></i>
            <span className='label'>Create plugin</span>
          </button>
        </div>
        <div className='double-transform'>
          <TransformView title='Before'
            content={this.props.input}
            types={this.props.plugins}
            onChange={this.updateInput}
            setType={this.props.setInputType} />

          <div className='divider'>
            <button onClick={this.transform}>🗲</button>
          </div>
          <TransformView title='After'
            content={this.props.output}
            types={this.props.outputTypes}
            errorMsg={this.props.errorMsg}
            setType={this.props.setOutputType} />

        </div>
      </div>
    );
  }
}

App.propTypes = {
  input: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    data: PropTypes.string
  }),
  output: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    data: PropTypes.string
  }),
  transform: PropTypes.func.isRequired,
  setInput: PropTypes.func.isRequired
};

export default App;