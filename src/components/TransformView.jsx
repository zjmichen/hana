import React, { PropTypes } from 'react';

const TransformView = ({title, content, types, onChange, setType}) => {
  const editProps = (onChange) ? { onChange } : { readOnly: true };
  const options = types.map((type, i) => (
    <option key={`${type.type}-${i}`} value={type.type}>{type.name}</option>
  ));

  return (
    <div className='transform-view'>
      <div className='title'>{title}</div>
      <select className='select' value={content.type} onChange={(event) => setType(event.target.value)}>
        <option value='' disabled>Select</option>
        {options}
      </select>
      <textarea className='preview' value={content.data} {...editProps}></textarea>
    </div>
  );
};

TransformView.propTypes = {
  title: PropTypes.string,
  content: PropTypes.shape({
    data: PropTypes.string,
    type: PropTypes.string
  }),
  onChange: PropTypes.func,
  setType: PropTypes.func.isRequired
};

export default TransformView;