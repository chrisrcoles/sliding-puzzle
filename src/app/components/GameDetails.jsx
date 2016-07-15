import React from 'react';


import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import GameOptions from './GameOptions';
import GameStatus from './GameStatus';

import store from '../store';
import {connect} from 'react-redux';

import {
  resetBoard
} from '../actions/game-details-actions';

import {
  updateValue
} from '../actions/game-puzzle-actions';

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

  render () {
    const {numMovesAlreadyMade, timer, boardHeight, boardWidth, error} = this.props.currentGame;
    let start = timer.start;
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

