import React from 'react';
import GamePuzzle from './GamePuzzle';
import GameDetails from './GameDetails';

/*
* {Layout} Component that serves as the container that
* holds {GamePuzzle} and {GameDetails}
*
* */
class Layout extends React.Component {

  constructor (props) {
    super(props);
  }

  /*
  * Pure component method that uses the Redux store state to create the options.
  *
  * */
  render () {
    return (
      <main className="layout">
        Classic Puzzle Game

        <div>
          <GamePuzzle timerStart={Date.now()}/>
          <GameDetails />
        </div>

      </main>
    )
  }
}

export default Layout;
