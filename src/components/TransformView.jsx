import React, { PropTypes } from 'react';

class TransformView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { type: props.type || '' };
    this.setType = this.setType.bind(this);
  }

  setType(event) {
    this.setState({ type: event.target.value });
  }

  componentWillReceiveProps(props) {
    if (props.type) {
      this.setState({ type: props.type, content: props.content });
    }
  }

  render() {
    return (
      <div className='transform-view'>
        <div className='title'>{this.props.title}</div>
        <select className='select' value={this.state.type} onChange={this.setType}>
          <option value='' disabled>Select</option>
          <option value='csv'>CSV</option>
          <option value='json'>JSON</option>
        </select>
        <textarea className='preview' value={this.props.content} onChange={this.props.onChange}></textarea>
      </div>
    );
  }
}

TransformView.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  type: PropTypes.string
};

export default TransformView;