import React from 'react';


import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import GameOptions from './GameOptions';
import store from '../store';
import {connect} from 'react-redux';

import {
  getBoardDetails,
  resetBoard,
  updateValue
} from '../actions/game-details-actions';
class GameDetails extends React.Component {

  constructor (props) {
    super(props);

  }

  componentDidMount() {
    store.dispatch(getBoardDetails())
  }

  _handleGiveUp (e) {
    console.log('_handleGiveUp()')
    e.preventDefault();

    location.reload();
  }

  _updateValue (value, type) {
    console.log(
      'update value!!', value
    )
    
    store.dispatch(updateValue({value, type}))

  }

  _handleReset(e) {
    console.log('_handleReset()')
    const document = window.document;
    const button = document.getElementById('reset')
    // const event = new Event('click');
    
    store.dispatch(resetBoard())
    button.dispatchEvent('click')
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

        <GameOptions handleReset={this._handleReset}
                     handleGiveUp={this._handleGiveUp}
                     updateValue={this._updateValue}
                     movesMade={numMovesAlreadyMade}
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

