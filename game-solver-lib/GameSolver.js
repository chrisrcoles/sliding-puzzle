'use strict';


const BlockNode = require('./BlockNode.js')

class GameSolver {

  constructor (board, queue) {
    this._board = board;
    this._queue = queue;
    this._checked = {}
  }

  solve() {
    console.log('solve()');

    let nodeNumber = 1;
    let queue = this._queue;
    let Board = this._board;

    let originalBoardConfig = Board._originalBoard;
    let solutionBoardConfig = Board._solutionBoard;

    let originNodePointer = null;

    // let val = Board.calculateManhattanDistance(1, 2);
    // console.log('val = ', val)

    let originNode = new BlockNode(
      Board.calculateCost(originalBoardConfig, 0, nodeNumber),
      nodeNumber,
      originalBoardConfig,
      originNodePointer
    );

    // console.log('origin node = ', originNode)



  }
}

module.exports = GameSolver;