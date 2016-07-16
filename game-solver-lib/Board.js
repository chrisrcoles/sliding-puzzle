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
    this._board = this.createBoard(board);
    this._solution = this.createBoard(solution);
    
    this._emptyIndex = emptyIndex;
    this._distances = {};
  }
  
  createBoard(board) {
    return board.map(b => {
      return !b && b != 0 ? '_' : b
    }).join("");
  }

  // => returns the number of empty slots and
  //  a tuple of slots that are legal moves
  getMoves (board) {

  }

  // => creates a new board by
  //  interchanging the tiles in the two slots passed
  makeMove (a, b) {

  }

  // => calculates cost heuristic; two parts:
  //  1. past - number of moves made so far
  //  2. future - an estimate of the moves needed
  //    to complete the puzzle
  cost(board, depth, number) {

  }

  calculateManhattanDistance(a, b) {

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





