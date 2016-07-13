import React from 'react';
import GamePuzzle from './GamePuzzle';
import GameDetails from './GameDetails';

import {Link} from 'react-router';

class Layout extends React.Component {

  constructor (props) {
    super(props);

  }

  render () {
    return (
      <main className="layout">
        Classic Puzzle Game

        <div>
          <GamePuzzle />
          <GameDetails />
        </div>

      </main>
    )
  }
}

export default Layout;
