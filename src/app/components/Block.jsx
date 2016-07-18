import React from 'react';

class Block extends React.Component {
  constructor (props) {
    super(props);

  }
  
  componentDidMount () {}
  componentWillMount () {}
  componentWillUnmount () {}

  render () {
    const {id, type, value} = this.props;

    const style = {
      float: 'left',
      position: 'relative',
      margin: '.8 %',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    };

    return (

      <div className={"block " + type}
           id={id}
           style={style}
           onClick={(e) => this.props.onBlockClick(e)}>
        <div className="block-value">
          {value}
        </div>

      </div>
    )
  }
};

Block.propTypes = {
  type: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  onBlockClick: React.PropTypes.func.isRequired
};

export default Block;
