import React from 'react';

import GameOptions from './GameOptions';
import GameStatus from './GameStatus';

import store from '../store';
import {connect} from 'react-redux';

import {
  resetBoard,
  requestHint,
  receivedHint
} from '../actions/game-details-actions';

/*
* {GameDetails} Component that represents all of the details of
* the current game, including {GameOptions} and {GameStatus}
*
* */
class GameDetails extends React.Component {

  constructor (props) {
    super(props);

  }

  componentDidMount() {}

  /*
   * Event handler method that is called when the give up button
   * is clicked. This method reloads the page.
   *
   * @param {Event} e
   * */
  _handleGiveUp (e) {
    e.preventDefault();
    location.reload();
  }

  /*
   * Event handler method that is called when the reset button
   * is clicked. This method Publishes a click event on the reset
   * button for a state update in the GamePuzzle._subscribeToResetButtonPublisher
   *
   * If the position can be moved, a state change is dispatched to
   * the Redux store to reset the board
   *
   * @param {Event} e
   * */
  _handleReset(e) {
    const document = window.document;
    const button = document.getElementById('reset');
    store.dispatch(resetBoard());
    button.dispatchEvent('click')
  }

  /*
   * Event handler method that is called when the hint button
   * is clicked. This method should call the gameSolver with
   * the necessary game data.
   *
   * Due to the asynchronous nature of the event call, when the
   * hint is requested, an event is dispatched to the Redux store
   * and when the hint is received, another event is dispatched to
   * the store.
   *
   * // TODO currently this method takes too long to complete and
   * causes the browser to crash. Due to the computational resources
   * needed, this should be fixed. Possible solutions are:
   * 1. Speeding up the algorithm.
   * 2. Moving the code to a backend API service that leverages a
   *    powerful scripting language, like C++, Java, or Python,
   *    and virtual machine processing power.
   *
   * @param {Event} e
   * */
  _handleHintRequest(e, gameData) {
    store.dispatch(requestHint());
    
    let url = 'http://localhost:8011/puzzle/solve';
    console.log('with game data ' + gameData)
    console.log('get hint with url = ', url)

    const options = {'Content-Type': 'application/json', crossOrigin: true};
    gameData.positionalBoard =  [].concat.apply([], gameData.positionalBoard);
    this.request('POST', url, gameData, options)
      .then(hint => {
        console.log('hint = ', hint)
        store.dispatch(receivedHint(hint))
      })
  }



  request (method, url, data, options) {
    options = options || {};


    return new Promise(function (resolve, reject) {
      var settings = Object.assign({method, url}, options);
      // stringify the data before it is sent
      settings.data = JSON.stringify(data);
      settings.error = function (jqXHR, textStatus, errorThrown) {
        reject({
                 statusCode: jqXHR.status,
                 errors: jqXHR.responseJSON && jqXHR.responseJSON.errors ?
                         jqXHR.responseJSON.errors : null
               });

        reject({jqXHR, textStatus, errorThrown})
      };
      settings.success = function (data, textStatus, jqXHR) {
        resolve(data);
      };

      $.ajax(settings); // Fire the request
    });
  }

  /*
  * Returns the seconds elapsed from the start of the game
  * {Number}
  *
  * @param {Object} timer
  *
  * */
  _getSeconds(timer) {
    let elapsed = timer.elapsed;
    let _elapsed = Math.round(elapsed / 100);

    return (_elapsed / 10).toFixed(1);
  }

  /*
   * Pure component method that uses the Redux store state to create the details.
   *
   * */
  render () {
    const {
      numMovesAlreadyMade, timer, boardHeight, boardWidth,
      error, boards, boardSolved
    } = this.props.currentGame;

    console.log('props for details ', this.props)
    const { requestingHint, hint, hintRequestTime } = this.props.gameDetails;

    const message = error ? error.msg : 'Keep Playing!';

    const {
      currentBoard, solvedBoard, positionalBoard
    } = boards;

    const seconds = this._getSeconds(timer);
    const requestHintText = 'Unknown';
    const numOfMoves = hint && hint.numberOfMoves ?
                       hint.numberOfMoves : requestHintText;

    const nextBestMoveIdx = hint && hint.nextBestMoveIdx ?
                            'Move empty block to ' + (hint.nextBestMoveIdx + 1) + ' space' : requestHintText;

    const gameData = {
      currentBoard, solvedBoard, positionalBoard, boardWidth, boardHeight
    };


    return (
      <section className="game-details">
        <div className="game-details-container">
          <GameStatus solved={boardSolved}/>
          <GameOptions message={message}
                       handleHintRequest={(e) => this._handleHintRequest(e, gameData)}
                       handleReset={this._handleReset}
                       handleGiveUp={this._handleGiveUp}
                       movesMade={numMovesAlreadyMade}
                       timerSeconds={seconds}
                       boardHeight={boardHeight}
                       boardWidth={boardWidth}
                       numOfMoves={numOfMoves}
                       nextBestMoveIdx={nextBestMoveIdx}
                       requestingHint={requestingHint}
                       hintRequestTime={hintRequestTime}/>
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
  timer: React.PropTypes.object,
  boardHeight: React.PropTypes.number,
  boardWidth: React.PropTypes.number,
  boards: React.PropTypes.object,
  error: React.PropTypes.object
};

export default connect(mapStateToProps)(GameDetails);

