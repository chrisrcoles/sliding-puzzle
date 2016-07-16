'use strict';

const PriorityQueue = require('./PriorityQueue.js');
// console.log('priority queue = ', PriorityQueue)
// let queue = new PriorityQueue();
//
// queue.enqueue({cash: 250, name: 'Valentina'});
// console.log('quee = ', queue)
// queue.enqueue({cash: 300, name: 'Jano'});
// queue.enqueue({cash: 150, name: 'Fran'});
// queue.size(); // 3
// queue.peek(); // { cash: 300, name: 'Jano' }
// queue.dequeue(); // { cash: 300, name: 'Jano' }
// queue.size(); // 2

const BlockNode = require('./BlockNode.js');

class Board {
  constructor (board, solution, emptyIndex) {
    Board.validateBoard(board);

    this._originalBoard = this.createBoard(board);
    this._solutionBoard = this.createBoard(solution);

    this._emptyIndex = emptyIndex;
    this._distances = [];
  }

  static validateBoard (board) {
    console.log('Make sure board is acceptable')
  }

  createBoard(board) {
    return board.map(b => {
      return !b && b != 0 ? '_' : b
    }).join("");
  }

  // => calculates cost heuristic; two parts:
  //  1. past - number of moves made so far
  //  2. future - an estimate of the moves needed
  //    to complete the puzzle
  calculateCost (board, depth, number) {
    let futureCost = 0;
    let pastCost = depth;
    let num, solutionPosition;

    for (num = 0; num < board.length; num++) {
      let tile = board[num];

      if (tile != '_') {
        solutionPosition = this._solutionBoard.indexOf(tile);

        futureCost += this.calculateManhattanDistance(tile, solutionPosition)

      }

    }

    return pastCost + futureCost
  }

  // => returns the number of empty slots and
  //  a tuple of slots that are legal moves
  getMoves (node) {

  }

  // => creates a new board by
  //  interchanging the tiles in the two slots passed
  makeMove (a, b) {

  }

  calculateManhattanDistance(pointA, pointB) {
    console.log('calculateManhattanDistance() ',
                'point a = ', pointA,
                'point b = ', pointB)

    let boardLength = this._originalBoard.length;
    let boardSquareRoot = Math.sqrt(boardLength);
    let aInt, bInt, aRow, aCol, bRow, bCol;
    let distance;
    let desiredDistance;

    for (var _a in [...Array(boardLength).keys()]) {
      for (var _b in [...Array(boardLength)]) {
        let a = parseInt(_a, 10);
        let b = parseInt(_b, 10);
        aRow = Math.floor(a / boardSquareRoot), aCol = Math.round(a % boardSquareRoot);
        bRow = Math.floor(b / boardSquareRoot), bCol = Math.round(b % boardSquareRoot);
        distance = Math.abs(aRow - bRow) + Math.abs(aCol - bCol);
        let coordinates = { distance, a, b};
        this._distances.push(coordinates)
      }
    }

    this._distances.forEach(distance => {
      if (distance.a == pointA && distance.b == pointB) {
        desiredDistance = distance.distance
      }
    });

    console.log('desired distance = ', desiredDistance)

    return desiredDistance;
  }


}

module.exports = Board;



// we try to estimate how good a partial solution is, that is,
// how close to the final solution, and requeue it based
// on this, we get good results.
// this is the heart of A-start algo
// rather than DFS or BFS we use a priority queue to
// reinsert a partial result ahead of others waiting if
// their "cost" is greater.





