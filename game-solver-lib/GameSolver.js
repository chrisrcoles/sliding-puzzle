'use strict';

const BlockNode = require('./BlockNode.js');

class GameSolver {

  constructor (board, queue) {
    this._board = board;
    this._queue = queue;
    this._checked = {}
  }

  solve(callback) {
    console.log('solve()');

    let nodeNumber = 1;
    let totalCount = 0;
    let grandFatherNode = null;
    let solutionFound = false;
    let Queue = this._queue;
    let Board = this._board;

    let originalBoardConfig = Board._originalBoard;

    let originNodePointer = 0;
    let originNodeCost = Board.calculateCost(originalBoardConfig, nodeNumber);

    let originNode = new BlockNode(
      originNodeCost,
      nodeNumber,
      originalBoardConfig,
      originNodePointer,
      grandFatherNode
    );

    // console.log('origin node = ', originNode);


    Queue.enqueue(originNode);

    // console.log('checked at top after ', this._checked)

    this._checked[originNode.board] = true;

    // console.log('checked at top before ', this._checked)

    this._solve(nodeNumber, totalCount, solutionFound, null, (err, solution) => {
      console.log('solution = ', solution)

      callback(solution)
    })
  }


  //
  _solve(nodeNumber, count, solutionFound, solution, cb) {
    let Queue = this._queue;
    let Board = this._board;
    console.log('queue length  ', Queue.size())

    // if (nodeNumber > 525) {
    //   cb(null,
    //     {hello: 'world'}
    //   )
    //   return
    //
    // }

    // base cases -- when solution is found
    if (solutionFound) {
      console.log('Solution found');
      cb(null, solution);
      return
    }

    if (!Queue._elements.length) {
      console.log('no more elements found');
      cb({
        err: 'NOT FOUND',
        descr: 'No solution can be found.'
         }, null);
    }

    let element = Queue.dequeue();

    console.log('ELEMENT TO PROCESS = ', element)

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
    let solutionBoard;

    console.log('moves for ', moves, ' for parent = ', parentBoard,
                'for empty space = ', empty)

    // console.log('parent board = ', boardMoves)
    moves.forEach(move => {
      console.log('FUCKING NODE NUM = ', nodeNumber)

      console.log('move = ', move.index)
      // console.log('moveToMake = ', moveToMake);
      child = Board.makeMove(parentBoard, empty, move.index);

      console.log('move made = ', child)
      // checkedAlready = this._checked[child] ? true : false;


      if (!this._checked[child]) {
        if (child == Board._solutionBoard) {
          console.log('solution found in  here = ', child, element)
          // solutionBoard = element;
          solutionFound = true;
          // this._solve(nodeNumber, count, true, child, cb)
        } else {
          solutionFound = false;
        }
        nodeNumber += 1;
        this._checked[child] = true
      }
      else {
        if (child == Board._solutionBoard) {
          console.log('solution found')
          solutionFound = true;

          // this._solve(nodeNumber, count, true, child, cb)
        } else {
          solutionFound = false;
        }

        console.log('child checked = ', child)
        return
      }



      depth = pointer + 1;
      priority = Board.calculateCost(child, depth, nodeNumber)

      console.log(' found priority = ', priority,
                  ' for child = ', child,
                  ' for depth = ', depth,
                  ' for node num = ', nodeNumber,
                  ' with count = ', count
      );

      let newNode = new BlockNode(
        priority,
        nodeNumber,
        child,
        depth,
        element
      );
      // enqueue new node
      Queue.enqueue(newNode);


    });


    // console.log('NODE NUMBER BEING sent ', nodeNumber)
    if (solutionFound) {
      console.log('not hit')
      this._solve(nodeNumber, count, true, element, cb)
    } else {
      console.log('hit ')
      this._solve(nodeNumber, count, false, null, cb)
    }
  }

}

module.exports = GameSolver;