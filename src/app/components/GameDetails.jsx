import React from 'react';

import GameOptions from './GameOptions';
import GameStatus from './GameStatus';

import store from '../store';
import {connect} from 'react-redux';

import GameSolver from '../game-solver-lib/GameSolver';

import {
  resetBoard,
  requestHint
} from '../actions/game-details-actions';

class GameDetails extends React.Component {

  constructor (props) {
    super(props);

  }

  componentDidMount() {}

  _handleGiveUp (e) {
    e.preventDefault();
    location.reload();
  }


  _handleReset(e) {
    const document = window.document;
    const button = document.getElementById('reset');
    store.dispatch(resetBoard())
    button.dispatchEvent('click')
  }

  _handleHintRequest(e, gameData) {
    store.dispatch(requestHint());
    // console.log('_handleHintRequest()', GameSolver);

  }

  render () {
    const {
      numMovesAlreadyMade, timer, boardHeight, boardWidth,
      error, boards
    } = this.props.currentGame;

    // const {
    //   currentBoard, solvedBoard, positionalBoard
    // } = boards;

    // const gameData = {
    //   currentBoard, solvedBoard, positionalBoard, boardWidth, boardHeight
    // };


    let elapsed = timer.elapsed;
    let _elapsed = Math.round(elapsed / 100);

    // This will give a number with one digit after the decimal dot (xx.x):
    const seconds = (_elapsed / 10).toFixed(1);
    let message;

    message = error ? error.msg : 'Keep Playing!'


    return (
      <section className="game-details">

        <div className="game-details-container">
          <GameStatus />
          <GameOptions message={message}
                       handleHintRequest={this._handleHintRequest}
                       handleReset={this._handleReset}
                       handleGiveUp={this._handleGiveUp}
                       movesMade={numMovesAlreadyMade}
                       timerSeconds={seconds}
                       boardHeight={boardHeight}
                       boardWidth={boardWidth}/>
        </div>

      </section>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    gameDetails: state.gameDetailsState,
    currentGame: state.gamePuzzleState
  }
};

export default connect(mapStateToProps)(GameDetails);

