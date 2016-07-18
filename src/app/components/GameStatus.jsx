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
    let boardSolved = this.props.boardSolved ? "Board Solved" : "Still unsolved"
    return (
      <div className="game-status">
        Solved: {boardSolved}
      </div>
    )
  }
}


export default GameStatus;

