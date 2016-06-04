import React from 'react';
import TransformView from './TransformView';
import { ipcRenderer } from 'electron';
import fs from 'fs';
import '../style/app-layout.less';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: {
        name: '',
        type: '',
        data: ''
      },
      output: ''
    };
    this.transform = this.transform.bind(this);
    this.chooseFile = this.chooseFile.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.updateInput = this.updateInput.bind(this);
  }

  transform() {
    const fromType = this.refs.before.state.type;
    const toType = this.refs.after.state.type;
    let data = '';

    const loader = require(`../../plugins/${fromType}/index`);
    if (!loader) throw new Error(`No loader found for ${fromType}`);
    if (!loader.tojson || !loader.fromjson) throw new Error(`Invalid loader for ${fromType}`);

    if (loader[`to${toType}`]) {
      data = loader[`to${toType}`](this.state.input.data);
    } else {
      const toLoader = require(`../../plugins/${toType}`);
      if (!toLoader) throw new Error(`No loader found for ${toType}`);
      if (!toLoader.tojson || !loader.fromjson) throw new Error(`Invalid loader for ${toType}`);

      data = toLoader.fromjson(loader.tojson(this.state.input.data));
    }

    data.then((data) => this.setState({output: data}));
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
      this.setState({
        input: {
          name: filename,
          type: filename.split('.').pop(),
          data
        }
      });
    });
  }

  updateInput(event) {
    this.setState({
      input: {
        ...this.state.input,
        data: event.target.value
      }
    });
  }

  render() {
    return (
      <div className='app-layout'>
        <div className='input'>
          <button onClick={this.chooseFile}>Choose file</button>
          <span className='filename'>{this.state.input.name}</span>
        </div>
        <div className='double-transform'>
          <TransformView ref='before' title='Before'
            content={this.state.input.data}
            type={this.state.input.type}
            onChange={this.updateInput} />

          <div className='divider'>
            <button onClick={this.transform}>🗲</button>
          </div>
          <TransformView ref='after' title='After'
            content={this.state.output}
            type='json' />

        </div>
      </div>
    );
  }
}