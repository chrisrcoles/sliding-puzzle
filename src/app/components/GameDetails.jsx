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
    store.dispatch(resetBoard());
    button.dispatchEvent('click')
  }

  _handleHintRequest(e, gameData) {
    store.dispatch(requestHint());
    console.log('_handleHintRequest()', gameData);
    const gameSolver = new GameSolver(gameData);

    gameSolver.solve()
      .then(boardSolution => {
        console.log("FINAL SOLUTION = ",
                    boardSolution.moves,
                    boardSolution.numberOfMoves,
                    'took ', gameSolver.elapsedTime, 'seconds'
        )
      })
      .catch(reason => {
        console.log('reason = ', reason)
      });

  }
  
  _getSeconds(timer) {
    let elapsed = timer.elapsed;
    let _elapsed = Math.round(elapsed / 100);

    return (_elapsed / 10).toFixed(1);
  }

  render () {
    const {
      numMovesAlreadyMade, timer, boardHeight, boardWidth,
      error, boards
    } = this.props.currentGame;
    
    const message = error ? error.msg : 'Keep Playing!';
    
    const {
      currentBoard, solvedBoard, positionalBoard
    } = boards;

    const seconds = this._getSeconds(timer);
    
    const gameData = {
      currentBoard, solvedBoard, positionalBoard, boardWidth, boardHeight
    };
    

    return (
      <section className="game-details">

        <div className="game-details-container">
          <GameStatus />
          <GameOptions message={message}
                       handleHintRequest={(e) => this._handleHintRequest(e, gameData)}
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
};

const mapStateToProps = (state) => {
  return {
    gameDetails: state.gameDetailsState,
    currentGame: state.gamePuzzleState
  }
};

GameDetails.propTypes = {
  numMovesAlreadyMade: React.PropTypes.number,
  // timer: React.PropTypes.object.isRequired,
  boardHeight: React.PropTypes.number,
  boardWidth: React.PropTypes.number,
  boards: React.PropTypes.object,
  error: React.PropTypes.object
};

export default connect(mapStateToProps)(GameDetails);

