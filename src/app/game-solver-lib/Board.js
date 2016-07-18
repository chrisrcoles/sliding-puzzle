'use strict';

// we try to estimate how good a partial solution is, that is,
// how close to the final solution, and requeue it based
// on this, we get good results.
// this is the heart of A-start algo
// rather than DFS or BFS we use a priority queue to
// reinsert a partial result ahead of others waiting if
// their "cost" is greater.
class Board {
  constructor (board, solution, positionalBoard, width, height) {
    Board.validateBoard(board);

    this._originalBoard = this.createBoard(board, 'string');
    this._solutionBoard = this.createBoard(solution, 'string');
    this._positionalBoard = this.createBoard(positionalBoard, 'array');
    this._width = width;
    this._height = height;

    this._distances = [];
  }

  static validateBoard (board) {
    console.log('Make sure board is acceptable')
  }

  createBoard(board, type) {
      if (type === 'string') {
        return board.map(b => {
          return !b && b != 0 ? '_' : b
        }).join("");
      }

    if (type === 'array') {
      return [].concat.apply([], board);
    }
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
    const empty = node.indexOf('_');
    const moves = this._getAllowedMoves(empty);
    return { empty, moves }
  }

  _getAllowedMoves (empty) {
    let positionalBoard = this._positionalBoard.slice();
    let emptyPosition = positionalBoard[empty];

    return  positionalBoard.filter((position, index) => {
      return this._getBlockMoves(emptyPosition, position, index)
    });
  }

  _getBlockMoves(empty, position, positionIndex) {
    // console.log('empty ', empty);
    // console.log('positon = ', position)
    // console.log('empty index = ', emptyIndex)
    // console.log('position index = ', positionIndex)
    // throw away the value as we don't need it anymore to update
    // the board, and it's too much to update as we go through
    // board variations, all we care about is the positions;
    delete position.value;
    let acceptableYPosition;
    let acceptableXPosition;


    // return
    if (position.y === empty.y) {
      let max = Math.max(position.x, empty.x);
      let min = Math.min(position.x, empty.x);

      if (max - min === 1) {
        acceptableYPosition = true
      }
    }

    if (position.x === empty.x) {
      let max = Math.max(empty.y, position.y);
      let min = Math.min(empty.y, position.y);

      if (max - min === 1) {
        acceptableXPosition = true
      }
    }

    if (acceptableXPosition || acceptableYPosition) {
      position.index = positionIndex;
      return position
    }
  }

  // => creates a new board by
  //  interchanging the tiles in the two slots passed
  makeMove (parentBoard, empty, move) {
    let newBoard = parentBoard.split("");
    var temp = newBoard[empty];
    newBoard[empty] = newBoard[move];
    newBoard[move] = temp;
    return newBoard.join("")
  }

  // calculates manhattan distance between two points
  calculateManhattanDistance (pointA, pointB) {
    let boardLength = this._originalBoard.length;
    let desiredDistance;

    for (var aa in [...Array(boardLength).keys()]) {
      for (var bb in [...Array(boardLength).keys()]) {
        aa = parseInt(aa, 10);
        bb = parseInt(bb, 10);

        let arow = Math.floor(aa / this._height), acol = Math.floor(aa % this._width);
        let brow = Math.floor(bb / this._width), bcol = Math.floor(bb % this._height);

        let distance = Math.abs(arow - brow) + Math.abs(acol - bcol);
        let manhattanRef = {distance, aa, bb};

        this._distances.push(manhattanRef)
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






