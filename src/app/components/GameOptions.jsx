import React from 'react';
import store from '../store';

class GameOptions extends React.Component {

  constructor (props) {
    super (props);
  }

  componentWillMount() {}

  _setBoardHeightAndWidth(height, width) {
    $('#grid-width').val(width);
    $('#grid-height').val(height);
  }
  componentDidMount () {
    const { boardHeight, boardWidth } = this.props
    this._setBoardHeightAndWidth(boardHeight, boardWidth)

  }
  componentWillUnmount() {}
  render () {
    const { movesMade, timerSeconds,
      boardHeight, boardWidth } = this.props;

    let time = "20 seconds";
    console.log('props for game options', this.props)

    return (
      <div className="game-options">

        <button id="restart"
                type="button">
          <p id="restart-text">Reset</p>
        </button>

        <button id="give-up"
                type="button">
          <p id="give-up-text">Give Up</p>
        </button>

          <form id="width-form"
                action="" method="">
            <div>
              <label>Width:</label>
              <input type="text" id="grid-width"/>
            </div>
          </form>

          <form id="height-form"
                action="" method="">
            <div>
              <label>Height:</label>
              <input type="text" id="grid-height"/>
            </div>
          </form>

        <div id="moves-made">
          <p>&#35; Moves Made:</p>{movesMade}
        </div>

        <div id="timer"
                type="button">
          Time: {timerSeconds}
        </div>


      </div>
    )


  }


}

export default GameOptions;