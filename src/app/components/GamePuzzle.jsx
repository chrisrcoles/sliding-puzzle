import React from 'react';
import { connect } from 'react-redux';
import Block from './Block';

import store from '../store';


import {
  setBoard,
  blockMoved,
  blockMoveNotAllowed,
  puzzleSolved,
  resetBoard,
  updateTimer,
  alertClientError
} from '../actions/game-puzzle-actions';

/*
* {GamePuzzle} Component that represents the actual game board
* */
class GamePuzzle extends React.Component {

  constructor (props) {
    super(props);

  }

  /*
  * Component Lifecycle Method, called before the initial rendering occurs,
  * calls three main functions.
  * 1. Subscribing to publisher delegates.
  * 2. Setting the game board, based on the board and max, width and height.
  * 3. Initializing the timer that updates the game clock.
  *
  * */
  componentDidMount () {
    const {boardWidth, boardHeight, maxWidth, maxHeight} = this.props.currentGame;
    const start = this.props.timerStart;
    this._subscribeToPublishers(maxWidth, maxHeight);
    this._setBoard(boardWidth, boardHeight, false, null);

    // timer
    // this.intervalId = setInterval(() => {
    //   const elapsed = new Date() - start;
    //   store.dispatch(updateTimer({start, elapsed}))
    // }, 1000);
  }

  /*
  * Component Lifecycle Method, invoked immediately before a component is
  * unmounted from the DOM, clears the interval set in the componentDidMount
  * method.
  *
  * */
  componentWillUnmount() {
    window.clearInterval(this.intervalId);
  }

  /*
  * Based on the Publisher/Subscriber Pattern, this method creates an
  * observer object that subscribes to all events for this component.
  * This method handles 1) reset button event
  * @param {Number} maxWidth, max width of the board
  * @param {Number} maxHeight max height of the board
  *
  * */
  _subscribeToPublishers(maxWidth, maxHeight) {
    this._subscribeToResetButtonPublisher(maxWidth, maxHeight)
  }

  /*
  * Subscriber handler that causes the board to reload based on the
  * newly entered width and height.
  *
  * If the newly entered width and/or height is out of range, the
  * board will display an error. If no error, the board will be set again.
  *
  * @param {Number} maxWidth
  * @param {Number} maxHeight
  *
  * */
  _subscribeToResetButtonPublisher (maxWidth, maxHeight) {
    let newDetails;
    const button = document.getElementById('reset');

    button.addEventListener("click", () => {
      let height = $('#grid-height').val();
      let width = $('#grid-width').val();
      let parsedWidth = parseInt(width, 10);
      let parsedHeight = parseInt(height, 10);
      let acceptableWidth = (1 <= parsedWidth && parsedWidth > maxWidth + 1);
      let acceptableHeight = (1 <= parsedHeight && parsedHeight > maxHeight + 1);

      if (acceptableWidth) {
        console.log('height not in range')
        let heightError = {
          type: '_invalid_height',
          code: 91,
          msg: 'Height is out of range. Make sure height is in between 1 and 5.'
        };

        store.dispatch(alertClientError(heightError));
        return;

      }
      else if (acceptableHeight) {
        let widthError = {
          type: '_invalid_width',
          code: 81,
          msg: 'Width is out of range. Make sure width is in between 1 and 5.'
        };
        store.dispatch(alertClientError(widthError));
        return;

      }
      else {
        newDetails = this._setBoard(parsedWidth, parsedHeight);
        store.dispatch(setBoard(newDetails));
      }
    });
  }

  /*
  * Recursive method that sets the board. This method dispatches an
  * event to the Redux store that sets the board based on the game board
  * data. This method will ensure that the board set is solvable.
  *
  * A board configuration is created based on the board width and height.
  * This board configuration creates several pieces of core data for the
  * representation of the game.
  *
  * The game data is compromised of:
  * 1. An initial board {@Array} that represents the initial board configuration.
  * 2. A current board {@Array} that represents the current board configuration.
  * 3. A two-dimensional positional board {@Array} that represents each of the
  *   board's positions in an object, that stores the x, y coordinates, along
  *   with the value of the block.
  * 4. A solved board {@Array} that represents the solved board configuration.
  * 5. The empty block index from the board that is set.
  * 6. The empty block value from the board that is set.
  * 7. The board width, set from the initial state in the Game Reducer.
  * 8. The board height, set from the initial state in the Game Reducer.
  *
  *
  * @param {Number} boardWidth
  * @param {Number} boardHeight
  * @param {Boolean} found
  * @param {Object} gameBoard
  *
  * */
  _setBoard (boardWidth, boardHeight, found, gameBoard) {
    if (found) {
      store.dispatch(setBoard(gameBoard));
      return
    }

    let totalNumberOfBlocks = boardWidth * boardHeight;

    const shuffledBoard = this.shuffleBoard([...Array(totalNumberOfBlocks).keys()].map(i => i + 1));
    const solvedBoard = [...Array(totalNumberOfBlocks).keys()].map(i => i + 1);
    const emptyBlockValue = this._getRandomIdx(1, totalNumberOfBlocks);

    const arraysEqual = this._arraysEqual(solvedBoard, shuffledBoard);

    if (arraysEqual) {
      this._setBoard(boardWidth, boardHeight, false, null)
    }

    let initialBoardData = this._prepareInitialBoard(shuffledBoard, emptyBlockValue)
    let solvedAndSetBoard = this._prepareSolvedAndSetBoard(solvedBoard, emptyBlockValue)

    const {initialBoard, emptyBlockIdx} = initialBoardData;
    const currentBoard = initialBoard;
    let positionalBoard = this._preparePositional2DBoard(initialBoard, boardWidth, boardHeight);
    let board = currentBoard.slice();

    const boardSolvable = this._boardSolvable(board, boardWidth, boardHeight, positionalBoard, emptyBlockIdx);

    if (boardSolvable) {
      const gBoard = {
        initialBoard,
        currentBoard,
        positionalBoard,
        solvedAndSetBoard,
        emptyBlockIdx,
        emptyBlockValue,
        boardWidth,
        boardHeight
      };
      this._setBoard(boardWidth, boardHeight, true, gBoard)
    }
    else {
      this._setBoard(boardWidth, boardHeight, false, null)
    }
  }

  /*
  * Returns a random index {Number}
  *
  * @param {Number} low
  * @param {Number} high
  *
  * */
  _getRandomIdx (low, high) {
    return Math.floor(Math.random() * (high - low)) + low;
  }

  /*
  * Returns whether two arrays are equal {Boolean}
  *
  * @param {Array} firstArray
  * @parm {Array} secondArray
  *
  * */
  _arraysEqual (firstArray, secondArray) {
    if (firstArray.length !== secondArray.length) {
      return
    }

    for (var el = firstArray.length; el--;) {
      if (firstArray[el] !== secondArray[el]) {
        return false
      }
    }

    return true;
  }

  /*
  * Returns a shuffled board {Array}
  *
  * @param {Array} array
  *
  * */
  shuffleBoard (array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /*
  * Returns a dimensional array where each element is represents a block,
  * containing each of the coordinates and values. {Array}
  *
  * @param {Array} board
  * @param {Number} boardWidth
  *
  * */
  _getPositionalBoard(board, boardWidth) {
    let row = 1;
    let column = 1;
    let positionalBoard = [];

    board.forEach(block => {
      if (column > boardWidth) {
        row++;
        column = 1;
      }

      var position = {
        x: row,
        y: column,
        value: block
      };

      column++;
      positionalBoard.push(position)
    });

    return positionalBoard
  }

  /*
  * Helper method that returns a two dimensional array based on
  * the dimensions of the board - width x height.
  *
  * @param {Array} dimensions
  *
  * */
  _get2DBoard(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : this._get2DBoard(dimensions.slice(1)));
    }

    return array;
  }

  /*
  * Returns the solution board {Array}
  *
  * @param {Array} board
  * @param {Number} value
  *
  * */
  _prepareSolvedAndSetBoard (board, value) {
    let b;
    let valueIdx;

    b = board.map((el, idx) => {
      if (el === value) {
        valueIdx = idx;
        return null
      }

      if (el > value) {
        return el - 1
      }
      else {
        return el
      }

    });

    var emptyBlock = b.splice(valueIdx, 1);
    b.push(emptyBlock);

    return b
  }

  /*
  * Returns the initial board and the emptyBlockIdx {Object}
  *
  * @param {Array} board
  * @param {Number} value
  *
  * */
  _prepareInitialBoard (board, value) {
    let initialBoard;
    let emptyBlockIdx;

    initialBoard = board.map((el, idx) => {
      if (el === value) {
        emptyBlockIdx = idx;
        return null
      }

      if (el > value) {
        return el - 1
      }
      else {
        return el
      }
    });

    return {initialBoard, emptyBlockIdx}
  }

  /*
  * Returns a two-dimensional board {Array} based on the board dimensions,
  * the positionalBoard array and the empty multiDimensionalBoard.
  *
  * @param {Array} board
  * @param {Number} boardWidth
  * @param {Number} boardHeight
  *
  * */
  _preparePositional2DBoard(board, boardWidth, boardHeight) {
    let position;
    let dimensions = [boardWidth, boardHeight];
    let positionalBoard = this._getPositionalBoard(board, boardWidth);
    let multidimensionalBoard = this._get2DBoard(dimensions);

    for (var i = 0; i < multidimensionalBoard.length; i++) {
      for (var j = 0; j < multidimensionalBoard[i].length; j++) {
        position = positionalBoard.pop();
        multidimensionalBoard[i][j] = position
      }
    }

    return multidimensionalBoard.reverse().map((b) => b.reverse())
  }

  /*
  * Returns whether or not the board is solvable {Boolean} by checking
  * the inversions of the board. Based on the number of inversions,
  * rows, and columns, the board configuration will either be
  * valid or not.
  *
  * @param {Array} board
  * @param {Number} width
  * @param {Number} height
  * @param {Array}{Object} positionalBoard
  * @param {Number} emptyBlockIdx
  *
  * */
  _boardSolvable (board, width, height, positionalBoard, emptyBlockIdx) {
    const inversions = this._countInversions(board, emptyBlockIdx);

    const evenNumberOfInversions = (inversions % 2) === 0;
    const oddNumberOfInversions = !evenNumberOfInversions;

    const evenBoardWidth = (width % 2) === 0;
    const oddBoardWidth = !evenBoardWidth;

    const oddBoardRow = this._boardRowOdd(positionalBoard, height);
    const evenBoardRow = !oddBoardRow;

    const case1 = (oddBoardWidth && evenNumberOfInversions);
    const case2 = (evenBoardWidth && evenBoardRow && oddNumberOfInversions);
    const case3 = (evenBoardWidth && oddBoardRow && evenNumberOfInversions);

    return (case1 || case2 || case3)
  }

  /*
  * Returns the number of inversions for the board by implementing merge sort.
  *
  * @param {Array} board
  * @param {Number} emptyBlockIdx
  *
  * */
  _countInversions (board, emptyBlockIdx) {
    // remove null from index
    board.splice(emptyBlockIdx, 1);
    let inversionsFound = 0;
    sort(board);
    return inversionsFound;

    function sort (arr) {
      if (arr.length === 1) return arr;
      let right = arr.splice(Math.floor(arr.length / 2), arr.length - 1);
      return merge(sort(arr), sort(right));
    }

    function merge (left, right) {
      let merged = [];
      let l = 0;
      let r = 0;
      let multiplier = 0;

      while (l < left.length || r < right.length) {
        if (l === left.length) {
          merged.push(right[r]);
          r++;
        }
        else if (r === right.length) {
          merged.push(left[l]);
          l++;
          inversionsFound += multiplier;
        }
        else if (left[l] < right[r]) {
          merged.push(left[l]);
          inversionsFound += multiplier;
          l++;
        }
        else {
          merged.push(right[r]);
          r++;
          multiplier++;
        }
      }
      return merged;
    }

  }

  /*
  * Returns whether or not the board row is odd {Boolean}
  *
  * @param {Array} board
  * @param {Number} height
  *
  * */
  _boardRowOdd (board, height) {
    let positionalIdx;
    let grid = {};

    board.forEach((board, idx) => {
      board.forEach(b => {
        if (!b.value) {
          positionalIdx = idx
        }
      })
    });

    for (var g = height - 1; g >= 0; g -= 2) {
      grid[g] = "odd row"
    }

    grid[positionalIdx] ? true : false;
  }

  /*
  * Event handler method that gets called when a block is clicked.
  * When a block is clicked, or attempted to be moved, the block
  * must be switched with the empty position.
  *
  * If the position can be moved, a state change is dispatched to
  * the Redux store with the empty block and the target block.
  *
  * @param {Event} e
  * */
  _handleBlockClick (e) {
    const {boards} = this.props.currentGame;
    const positionalBoard = boards.positionalBoard;
    const solvedBoard = boards.solvedBoard;
    const currentBoard = boards.currentBoard;

    let target = "#" + e.target.id;

    let targetPosition = $(target);
    let emptyPosition = $('#empty');

    let targetPositionValue = targetPosition.text();

    const {positionCanBeMoved, emptyBlock, targetBlock} = this._checkIfBlockCanBeMoved(targetPositionValue, positionalBoard, emptyPosition);

    if (!positionCanBeMoved) {
      store.dispatch(blockMoveNotAllowed({targetPositionValue}));
      return
    }

    store.dispatch(blockMoved({emptyBlock, targetBlock}));
    this._checkIfPuzzleSolved(currentBoard, solvedBoard)
  }

  /*
  * Returns whether or not the empty position - value-  is empty, one of the
  * cases for a successful block move {Boolean}
  *
  * @param {jQuerySelector} emptyPosition
  * */
  _checkIfPositionCanBeMoved (emptyPosition) {
    return !emptyPosition.is(':empty')
  }

  /*
  * Checks two conditions to check whether the block can be moved:
  * 1. If the block is adjacent.
  * 2. If the html element is not empty.
  *
  * @param {String} targetPositionValue
  * @param {Array} positionalBoard
  * @param {jQuerySelector} emptyPosition
  *
  * Returns {Object} that contains the target and empty block along with
  * a boolean value for whether or not the target position can be moved.
  *
  * */
  _checkIfBlockCanBeMoved (targetPositionValue, positionalBoard, emptyPosition) {
    const {adjacent, emptyBlock, targetBlock} = this._checkIfBlockIsAdjacent(targetPositionValue, positionalBoard);
    let canBeMoved = this._checkIfPositionCanBeMoved(emptyPosition);
    let positionCanBeMoved;

    if (adjacent && canBeMoved) {
      positionCanBeMoved = true;
      return {positionCanBeMoved, emptyBlock, targetBlock}
    }
    else {
      positionCanBeMoved = false;
      return {positionCanBeMoved, emptyBlock, targetBlock}
    }
  }

  /*
  * Checks the target position against the empty position
  * to determine whether the block is adjacent, one of the cases
  * for whether the block can be moved. This method uses
  * the coordinates in the positional board representation
  * to determine whether the block is adjacent.
  *
  * Returns {Object} that contains the target and empty block along with
  * a boolean value for whether or not the target position is adjacent.
  *
  * @param {Number} targetPositionValue
  * @param {Array} positionalBoard
  *
  * */
  _checkIfBlockIsAdjacent(targetPositionValue, positionalBoard) {
    let emptyBlock;
    let targetBlock;
    let acceptableXPosition;
    let acceptableYPosition;
    let adjacent;
    let targetPositionValueInt = parseInt(targetPositionValue, 10);

    positionalBoard.forEach((board, boardIdx) => {
      board.forEach(ref => {
        if (!ref.value) {
          emptyBlock = {ref, boardIdx }
        }

        if (ref.value === targetPositionValueInt) {
          targetBlock = {ref, boardIdx}
        }
      })
    });

    if (targetBlock.ref.y === emptyBlock.ref.y) {
      let max = Math.max(targetBlock.boardIdx, emptyBlock.boardIdx);
      let min = Math.min(targetBlock.boardIdx, emptyBlock.boardIdx);

      if (max - min === 1) {
        acceptableYPosition = true
      }
    }

    if (targetBlock.ref.x === emptyBlock.ref.x) {
      let max = Math.max(targetBlock.ref.y, emptyBlock.ref.y);
      let min = Math.min(targetBlock.ref.y, emptyBlock.ref.y);

      if (max - min === 1) {
        acceptableXPosition = true
      }
    }

    if (acceptableXPosition || acceptableYPosition) {
      adjacent = true;
      return {adjacent, emptyBlock, targetBlock }
    } else {
      adjacent = false;
      return {adjacent, emptyBlock, targetBlock}
    }
  }


  /*
  * Determines if the puzzle is solved. If the puzzle has been solved
  * an event is dispatched to the Redux store to notify the user.
  * */
  _checkIfPuzzleSolved (currentBoard, solvedBoard) {
    const arraysEqual = this._arraysEqual(currentBoard, solvedBoard);

    if (arraysEqual) {
      store.dispatch(puzzleSolved())
    }
  }

  /*
  * Pure component method that uses the Redux store state to create the board.
  *
  * */
  render () {
    let id, value;
    let puzzleBlocks = [];
    const { boardWidth, boardHeight, boards } = this.props.currentGame;
    const type = "type-" + boardWidth + "x" + boardHeight;
    let currentBoard = boards.currentBoard;

    currentBoard.forEach((block, idx) => {
      if (!block) {
        id = "empty";
        value = "."
      } else {
        id = "block-" + (idx + 1);
        value = block
      }

      puzzleBlocks.push(
        <Block id={id}
        key={idx}
        type={type}
        value={value}
        onBlockClick={(e) => this._handleBlockClick(e)}/>
      )
    });

    return (
      <section className={"game-puzzle " + type}>
        <div className="puzzle-blocks">
          {puzzleBlocks}
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    currentGame: state.gamePuzzleState,
    gameDetails: state.gameDetailsState
  }
};

export default connect(mapStateToProps)(GamePuzzle);
