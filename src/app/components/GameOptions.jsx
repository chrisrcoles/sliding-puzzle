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
    const { movesMade, timerSeconds } = this.props;
    console.log('props for game options', this.props)

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

          <form id="width-form"
                action="" method="">
            <div>
              <label>Width:</label>
              <input onChange={(e) => this.props.updateValue(e.target.value, 'width')}
                      id="grid-width"
                      type="text"/>
            </div>
          </form>

          <form id="height-form"
                action="" method="">
            <div>
              <label>Height:</label>
              <input onChange={(e) => this.props.updateValue(e.target.value, 'height')}
                     id="grid-height"
                     type="text"/>
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