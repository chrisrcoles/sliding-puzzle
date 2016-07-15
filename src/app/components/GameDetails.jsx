import React from 'react';


import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import GameOptions from './GameOptions';
import store from '../store';
import {connect} from 'react-redux';

import {
  getBoardDetails,
} from '../actions/game-details-actions';
class GameDetails extends React.Component {

  constructor (props) {
    super(props);

  }

  componentDidMount() {
    store.dispatch(getBoardDetails())
  }

  render () {

    const {numMovesAlreadyMade, timer, boardHeight, boardWidth} = this.props.currentGame;
    console.log('store props in details = ', this.props);
    let start = timer.start;
    let elapsed = timer.elapsed;
    let _elapsed = Math.round(elapsed / 100); 
    

    // This will give a number with one digit after the decimal dot (xx.x):
    const seconds = (_elapsed / 10).toFixed(1);

    return (
      <section className="game-details">
        <h2>Sliding Puzzle</h2>
        <GameOptions movesMade={numMovesAlreadyMade}
                     timerSeconds={seconds}
                     boardHeight={boardHeight}
                     boardWidth={boardWidth}/>
      </section>
    )
  }
}


const mapStateToProps = (state) => {
  // 2. map state to correct props
  console.log('map state to props with state', state)
  return {
    gameDetails: state.gameDetailsState,
    currentGame: state.gamePuzzleState
  }
};

export default connect(mapStateToProps)(GameDetails);

