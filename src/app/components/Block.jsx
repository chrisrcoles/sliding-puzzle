import React from 'react';

class Block extends React.Component {

  constructor (props) {
    super(props);

  }


  componentWillMount () {

  }

  render () {
    
    console.log('props for block', this.props)

    const {id, type, value} = this.props;
    let newValue = (this.props.id === "empty") ?
                   '' : value;

    return (

      <div className={"block " + type}
           id={id}
           onClick={(e) => this.props.onBlockClick(e)}>
        {newValue}

      </div>
    )
  }
}

export default Block;
