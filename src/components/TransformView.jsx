import React, { PropTypes } from 'react';

const TransformView = ({title, content, types = [], errorMsg, onChange, setType}) => {
  const editProps = (onChange) ? { onChange } : { readOnly: true };
  const options = types.map((type, i) => (
    <option key={`${type.type}-${i}`} value={type.type}>{type.name}</option>
  ));
  const errClass = (errorMsg) ? ' -error' : '';
  const displayText = errorMsg || content.data;

  return (
    <div className={'transform-view' + errClass}>
      <div className='title'>{title}</div>
      <select className='select' value={content.type} onChange={(event) => setType(event.target.value)}>
        <option value='' disabled>Select</option>
        {options}
      </select>
      <textarea className='preview' value={displayText} {...editProps}></textarea>
    </div>
  );
};

TransformView.propTypes = {
  title: PropTypes.string,
  content: PropTypes.shape({
    data: PropTypes.string,
    type: PropTypes.string
  }),
  types: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    outputs: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string
    }))
  })),
  errorMsg: PropTypes.string,
  onChange: PropTypes.func,
  setType: PropTypes.func.isRequired
};

export default TransformView;