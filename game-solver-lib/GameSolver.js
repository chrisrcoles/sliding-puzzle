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
    let totalCount = 1;
    let grandFatherNode = null;
    let solutionFound = false;
    let Queue = this._queue;
    let Board = this._board;

    let originalBoardConfig = Board._originalBoard;
    let solutionBoardConfig = Board._solutionBoard;

    let originNodePointer = 0;
    let originNodeCost = Board.calculateCost(originalBoardConfig, nodeNumber);

    let originNode = new BlockNode(
      originNodeCost,
      nodeNumber,
      originalBoardConfig,
      originNodePointer,
      grandFatherNode
    );

    console.log('node = ', originNode);


    Queue.enqueue(originNode);
    this._checked[originNode] = true;
    this._solve(nodeNumber, totalCount, solutionFound, null)
  }


  //
  _solve(nodeNumber, count, solutionFound, solution, cb) {
    let Queue = this._queue;
    let Board = this._board;

    // base cases -- when solution is found
    if (solutionFound) {
      console.log('Solution found');
      cb(solution);
    }

    if (!Queue._elements.length) {
      console.log('no more elements found');
      cb({
        err: 'NOT FOUND',
        descr: 'No solution can be found.'
         });
    }

    // const { cost, nodeNumber, board, pointer, grandfatherNode } = element;
    // junk1, junk2, parent, pdepth, grandpa

    //  paass function the the queue
    let element = Queue.dequeue();

    // cost, nodeNumber, board, 0, None

    // check from here
    const parentBoard = element.board;
    let pointer = element.pointer;
    // increment count
    count += 1;

    const boardMoves = Board.getMoves(parentBoard);
    let empty = boardMoves.empty;
    let moves = boardMoves.moves;
    let child;
    let checkedAlready;
    let depth;
    let priority;

    // console.log('parent board = ', parentBoard)
    moves.forEach(move => {
      // console.log('move = ', move)
      // console.log('moveToMake = ', moveToMake);
      child = Board.makeMove(parentBoard, empty, move.index);
      checkedAlready = this._checked[child] ? true : false;

      if (!checkedAlready) {
        this._checked[child] = true
      }

      nodeNumber += 1;
      // console.log('NODE NUM = ', nodeNumber)
      depth = pointer + 1;
      // low cost = high priority
      priority = Board.calculateCost(child, depth, nodeNumber)
      // console.log('priority = ', priority)
      // console.log('COUNT = ', count)
      console.log('child = ', child)

      let newNode = new BlockNode(
        priority,
        nodeNumber,
        child,
        depth,
        element,
        null
      );
      // enqueue new node
      Queue.enqueue(newNode);

      if (child === Board._solutionBoard) {
        this._solve(nodeNumber, count, true, child, cb)
      }
    });
    this._solve(nodeNumber, count, false, null, cb)
  }

}

module.exports = GameSolver;