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
    let count = 0;
    let solutionFound = false;
    let queue = this._queue;
    let Board = this._board;

    let originalBoardConfig = Board._originalBoard;
    let solutionBoardConfig = Board._solutionBoard;

    let originNodePointer = null;
    let originNodeCost = Board.calculateCost(originalBoardConfig, nodeNumber);

    console.log('cost = ', originNodeCost)

    // console.log('cost == ', originNodeCost)
    //
    // let originNode = new BlockNode(
    //   originNodeCost,
    //   nodeNumber,
    //   originalBoardConfig,
    //   originNodePointer
    // );
    //
    // queue.enqueue(originNode);
    // this._checked[originNode] = true;
    // this._solve(nodeNumber, count, solutionFound)
  }

  _solve(nodeNumber, count, solutionFound) {
    let queue = this._queue;

    if (solutionFound) {
      console.log('STOP');
      return
    }

    if (!queue._elements.length) {
      console.log('no more elements found');
      return
    }

    let element = queue.dequeue();

    console.log('element = ', element)


  }


}

module.exports = GameSolver;