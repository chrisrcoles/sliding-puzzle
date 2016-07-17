'use strict';

const BlockNode = require('./BlockNode.js');
const Board = require('./Board.js');
const PriorityQueue = require('./PriorityQueue');

class GameSolver {

  constructor(gameData) {
    this._gameData = gameData;
    this._board = this.createGameBoard(gameData);
    this._queue = this.createPriorityQueue();
    this._checked = {};
    this.startTime = new Date();
    this.endTime = null;
    this.elapsedTime = null;
  }

  createGameBoard() {
    if (!this._board) {
      this._board = new Board(
        this._gameData.currentBoard,
        this._gameData.solutionBoard,
        this._gameData.positionalBoard,
        this._gameData.width,
        this._gameData.height
      );
    }

    return this._board
  }

  createPriorityQueue() {
    if (!this._queue) {
      this._queue = new PriorityQueue();
    }

    return this._queue
  }

  solve() {
    let nodeNumber = 1;
    let totalCount = 0;
    let grandFatherNode = null;
    let solutionFound = false;
    let Queue = this._queue;
    let Board = this._board;
    let moves = [];

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

    Queue.enqueue(originNode);

    this._checked[originNode.board] = true;

    return new Promise((resolve, reject) => {
      this._solve(nodeNumber,
                  totalCount,
                  solutionFound,
                  null,
                  (err, solution) => {
                    if (err) {
                      reject(err)
                    }
                    this._solvePuzzle(solution,
                                      moves,
                                      (boardSolution) => {
                                        resolve(boardSolution)
                                      })
                  })
    });
  }

  _solvePuzzle(solution, moves, cb) {
    let key = 'board';

    for (var node in solution) {
      if (node == key) {
        moves.push(solution[node])
      }
    }

    if (!solution) {
      this._setTimes();
      moves.unshift(this._board._solutionBoard);
      const numberOfMoves = moves.length;
      cb({moves, numberOfMoves})
    }

    this._solvePuzzle(solution.grandFatherNode, moves, cb)
  }

  _setTimes() {
    this.endTime = new Date();
    let elapsed = Math.round((this.endTime - this.startTime) / 100);
    let e = (elapsed / 10).toFixed(1);
    this.elapsedTime = e;
  }


  _solve(nodeNumber, count, solutionFound, solution, cb) {
    let Queue = this._queue;
    let Board = this._board;

    if (solutionFound) {
      return cb(null, solution);
    }

    if (!Queue._elements.length) {
      return cb({
        err: 'NOT FOUND',
        description: 'No solution can be found.'
         }, null);
    }

    let element = Queue.dequeue();
    const parentBoard = element.board;
    let pointer = element.pointer;
    count += 1;

    const boardMoves = Board.getMoves(parentBoard);
    let empty = boardMoves.empty;
    let moves = boardMoves.moves;
    let child;
    let depth;
    let priority;

    moves.forEach(move => {
      child = Board.makeMove(parentBoard, empty, move.index);

      if (!this._checked[child]) {
        if (child == Board._solutionBoard) {
          solutionFound = true;
        } else {
          solutionFound = false;
        }
        nodeNumber += 1;
        this._checked[child] = true
      }
      else {
        if (child == Board._solutionBoard) {
          solutionFound = true;
        } else {
          solutionFound = false;
        }

        return
      }

      depth = pointer + 1;
      priority = Board.calculateCost(child, depth, nodeNumber);

      let newNode = new BlockNode(
        priority,
        nodeNumber,
        child,
        depth,
        element
      );

      Queue.enqueue(newNode);
    });

    if (solutionFound) {
      this._solve(nodeNumber, count, true, element, cb)
    } else {
      this._solve(nodeNumber, count, false, null, cb)
    }
  }

}

module.exports = GameSolver;