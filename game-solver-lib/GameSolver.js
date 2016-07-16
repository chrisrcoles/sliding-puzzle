'use strict';


const BlockNode = require('./BlockNode.js')

class GameSolver {

  constructor (board, queue) {
    this._board = board;
    this._queue = queue;
  }

  solve() {
    console.log('solve()');
    console.log('board = ', this._queue)


  }
}

module.exports = GameSolver;