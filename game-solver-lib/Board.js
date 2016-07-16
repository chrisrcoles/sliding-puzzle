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
  constructor (board, solution) {
    Board.validateBoard(board);

    this._originalBoard = this.createBoard(board);
    this._solutionBoard = this.createBoard(solution);

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
  calculateCost (board, depth) {
    let futureCost = 0;
    let pastCost = depth;
    let num, solutionPosition;

    for (num = 0; num < board.length; num++) {
      let tile = board[num];
      console.log('occupant = ', tile)

      if (tile != '_') {
        solutionPosition = this._solutionBoard.indexOf(tile);
        futureCost += this.calculateManhattanDistance(num, solutionPosition)
      }
    }

    return pastCost + futureCost * 3
  }

  // => returns the number of empty slots and
  //  a tuple of slots that are legal moves
  getMoves (node) {

  }

  // => creates a new board by
  //  interchanging the tiles in the two slots passed
  makeMove (a, b) {

  }

  // calculates manhattan distance between two points
  calculateManhattanDistance (pointA, pointB) {
    let boardLength = this._originalBoard.length;
    let boardSquareRoot = Math.sqrt(boardLength);
    let desiredDistance;

    console.log('calculateManhattanDistance()', pointA, pointB)

    for (var aa in [...Array(boardLength).keys()]) {

      for (var bb in [...Array(boardLength).keys()]) {
        aa = parseInt(aa, 10)
        bb = parseInt(bb, 10)
        var arow = Math.floor(aa / boardSquareRoot);
        var brow = Math.floor(bb / boardSquareRoot);

        var acol = Math.floor(aa % boardSquareRoot);
        var bcol = Math.floor(bb % boardSquareRoot);

        var distance = Math.abs(arow - brow) + Math.abs(acol - bcol);

        var o = {distance, aa, bb};
        this._distances.push(o)
      }

    }

    this._distances.forEach(distance => {
      if (distance.aa == pointA && distance.bb == pointB) {
        desiredDistance = distance.distance
      }
    });

    return desiredDistance
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





