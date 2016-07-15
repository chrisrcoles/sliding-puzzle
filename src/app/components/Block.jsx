import React from 'react';

class Block extends React.Component {

  constructor (props) {
    super(props);

  }


  componentWillMount () {

  }

  render () {
    const {id, type, value} = this.props;
    // TODO value cannot be null, figure out way to now show missing number
    // possibly hint
    let newValue = (this.props.id === "empty") ?
                   '' : value;

    const style = {
      float: 'left',
      position: 'relative',
      margin: '.8 %',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      fontFamily: 'monospace'
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
}

export default Block;
