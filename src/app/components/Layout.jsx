import React from 'react';
import GamePuzzle from './GamePuzzle';
import GameDetails from './GameDetails';

class Layout extends React.Component {

  constructor (props) {
    super(props);
  }

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
