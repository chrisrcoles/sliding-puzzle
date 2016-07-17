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
    let totalCount = 0;
    let grandFatherNode = null;
    let solutionFound = false;
    let Queue = this._queue;
    let Board = this._board;

    let originalBoardConfig = Board._originalBoard;
    let solutionBoardConfig = Board._solutionBoard;

    let originNodePointer = null;
    let originNodeCost = Board.calculateCost(originalBoardConfig, nodeNumber);

    console.log('cost = ', originNodeCost);


    let originNode = new BlockNode(
      originNodeCost,
      nodeNumber,
      originalBoardConfig,
      originNodePointer,
      grandFatherNode
    );

    Queue.enqueue(originNode);
    this._checked[originNode] = true;
    this._solve(nodeNumber, totalCount, solutionFound)
  }


  //
  _solve(nodeNumber, count, solutionFound) {
    let Queue = this._queue;
    let Board = this._board;

    // base cases -- when solution is found
    if (solutionFound) {
      console.log('STOP');
      return
    }

    if (!Queue._elements.length) {
      console.log('no more elements found');
      return
    }

    // const { cost, nodeNumber, board, pointer, grandfatherNode } = element;
    // junk1, junk2, parent, pdepth, grandpa

    //  paass function the the queue
    let element = Queue.dequeue();
    
    // cost, nodeNumber, board, 0, None
    const parentBoard = element.board;
    let depth = element.nodeNumber;
    // increment count
    count += 1;

    const boardMoves = Board.getMoves(parentBoard);






  }


}

module.exports = GameSolver;