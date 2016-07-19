import React from 'react';

/*
 * {GameOptions} Component that represents all of the options of
 * the current game. This component is a display component that
 * has no knowledge of the Redux store and uses the props to create
 * the necessary data bindings.
 *
 * */
class GameOptions extends React.Component {

  constructor (props) {
    super (props);
  }


  /*
  * Places the height and width values in the initial forms.
  *
  * */
  _setBoardHeightAndWidth(height, width) {
    $('#grid-width').val(width);
    $('#grid-height').val(height);
  }

  /*
  * Component Lifecycle Method, called before the initial rendering occurs,
  * calls one main function:
  * 1. Setting the board height and width.
  *
  * */
  componentDidMount () {
    const { boardHeight, boardWidth } = this.props;
    this._setBoardHeightAndWidth(boardHeight, boardWidth)
  }

  /*
   * Pure component method that uses the Redux store state to create the options.
   *
   * */
  render () {
    const { movesMade, timerSeconds, message,
      nextBestMoveIdx, numOfMoves, requestingHint,
      hintRequestTime } = this.props;

    let requestingHintValue, requestingHintWarning;
    if (requestingHint) {
      requestingHintWarning = 'Don\'t move the board while hint is ' +
        'requesting for accuracy';
      requestingHintValue = 'Requesting a Hint'
    } else {
      requestingHintWarning = 'Okay to move board!';
      requestingHintValue = 'Get a Hint!'
    }

    let timeFound;

    if (hintRequestTime && !requestingHint && nextBestMoveIdx) {
      timeFound = "Last hint found in " + hintRequestTime + " seconds."
    } else if (requestingHint) {
      timeFound = "Requesting hint."
    } else {
      timeFound = "Find a hint"
    }

    console.log(
      'give me stuff ', nextBestMoveIdx,
      'moves = ', numOfMoves,
      'hint = ', requestingHint
    )


    return (
      <div className="game-options">
        <button id="reset"
                type="button">
          <p id="reset-text">Reset</p>
        </button>

        <button onClick={(e) => this.props.handleGiveUp(e)}
                id="give-up"
                type="button">
          <p id="give-up-text">Give Up</p>
        </button>

          <form id="width-form">
            <div>
              <label>Width:</label>
              <input id="grid-width"
                     type="text"/>
            </div>
          </form>

          <form id="height-form">
            <div>
              <label>Height:</label>
              <input id="grid-height"
                     type="text"/>
            </div>
          </form>

        <div id="moves-made">
          &#35; Moves Made: {movesMade}
        </div>

        <div id="status-message">
          {message}
        </div>

        <div id="timer"
                type="button">
          Time: {timerSeconds}
        </div>

        <button onClick={(e) => this.props.handleHintRequest(e)}
                id="hint"
                type="button">
          <p id="get-hint">{requestingHintValue}</p>
        </button>

        <div id="next-best-move">
          <p id="get-hint">{requestingHintWarning}</p>
          Next Best Move: {nextBestMoveIdx}
        </div>
        <div id="shortest-num-moves">
          &#35; of Moves: {numOfMoves}
        </div>
        <div id="hint-found-time">
          {timeFound}
        </div>

      </div>
    )
  }
};


GameOptions.PropTypes = {
  shortestNumberOfMoves: React.PropTypes.number,
  nextBestMove: React.PropTypes.string,
  message: React.PropTypes.string.isRequired,
  timerSeconds: React.PropTypes.number,
  boardHeight: React.PropTypes.number.isRequired,
  boardWidth: React.PropTypes.number.isRequired,
  handleGiveUp: React.PropTypes.func.isRequired,
  handleHintRequest: React.PropTypes.func.isRequired
};

export default GameOptions;