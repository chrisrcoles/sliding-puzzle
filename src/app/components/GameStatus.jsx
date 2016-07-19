import React from 'react';

/*
* TODO Implement
*
* */
class GameStatus extends React.Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {}

  render () {
    let boardSolved = this.props.boardSolved ? "Solved" : "Still unsolved"
    return (
      <div className="game-status">
        <p id="solved-status">{boardSolved}</p>
      </div>
    )
  }
}


export default GameStatus;

