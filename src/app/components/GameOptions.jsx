import React from 'react';

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
    const { movesMade, timerSeconds, message } = this.props;
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
              <input id="grid-width"
                     type="text"/>
            </div>
          </form>

          <form id="height-form"
                action="" method="">
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


      </div>
    )


  }


}

export default GameOptions;