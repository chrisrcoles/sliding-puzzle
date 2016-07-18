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

class GamePuzzle extends React.Component {

  constructor (props) {
    super(props);

  }

  componentWillMount () {}

  componentWillUnmount() {
    window.clearInterval(this.intervalId);
  }

  _subscribeListeners(maxWidth, maxHeight) {
    this._subscribeResetButton(maxWidth, maxHeight)
  }

  _subscribeResetButton (maxWidth, maxHeight) {
    const button = document.getElementById('reset');

    let newDetails;

    button.addEventListener("click", () => {
      console.log('clicked!')

      let height = $('#grid-height').val();
      let width = $('#grid-width').val();
      let parsedWidth = parseInt(width, 10);
      let parsedHeight = parseInt(height, 10);
      let acceptableWidth = (1 <= parsedWidth && parsedWidth > maxWidth + 1);
      let acceptableHeight = (1 <= parsedHeight && parsedHeight > maxHeight + 1);
      // let bothAcceptable = (acceptableWidth && acceptableHeight)

      if (acceptableWidth) {
        console.log('height not in range')
        let heightError = {
          type: '_invalid_height',
          code: 91,
          msg: 'Height is out of range. Make sure height is in between 1 and 5.'
        };

        store.dispatch(alertClientError(heightError))
        return

      }
      else if (acceptableHeight) {
        console.log('width not in range')
        let widthError = {
          type: '_invalid_width',
          code: 81,
          msg: 'Width is out of range. Make sure width is in between 1 and 5.'
        };
        store.dispatch(alertClientError(widthError))
        return

      }
      else {
        newDetails = this._setBoard(parsedWidth, parsedHeight)
        store.dispatch(setBoard(newDetails))
      }
    });
  }

  componentDidMount () {
    const { boardWidth, boardHeight, maxWidth, maxHeight } = this.props.currentGame;
    const boardDetails = this._setBoard(boardWidth, boardHeight);
    const start = this.props.timerStart;

    this._subscribeListeners(maxWidth, maxHeight)

    // this._setBoard(boardWidth, boardHeight, (board))
    // this.intervalId = setInterval(() => {
    //   const elapsed = new Date() - start;
    //   store.dispatch(updateTimer({start, elapsed}))
    // }, 1000);

    store.dispatch(setBoard(boardDetails));
  }

  _tick (start) {
      const elapsed = new Date() - start;
      store.dispatch(updateTimer({start, elapsed}))
  }

  _getRandomIdx (low, high) {
    return Math.floor(Math.random() * (high - low)) + low;
  }

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

  shuffleBoard (array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  _setBoard(boardWidth, boardHeight) {
    console.log('setBoard called()', boardWidth, boardHeight)

    let totalNumberOfBlocks = boardWidth * boardHeight;

    const shuffledBoard = this.shuffleBoard([...Array(totalNumberOfBlocks).keys()].map(i => i + 1));
    const solvedBoard = [...Array(totalNumberOfBlocks).keys()].map(i => i + 1);
    const emptyBlockValue = this._getRandomIdx(1, totalNumberOfBlocks);

    console.log('shuffled board ', shuffledBoard)
    console.log('solved board ', solvedBoard)
    console.log('empty block value ', emptyBlockValue)

    const arraysEqual = this._arraysEqual(solvedBoard, shuffledBoard);

    if (arraysEqual) {
      this._setBoard(boardWidth, boardHeight)
    }
    
    return this._prepareBoard(solvedBoard, shuffledBoard, emptyBlockValue, boardWidth, boardHeight)
  }

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

  _get2DBoard(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
      array.push(dimensions.length == 1 ? 0 : this._get2DBoard(dimensions.slice(1)));
    }

    return array;
  }

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

  _prepareBoard (solvedBoard, shuffledBoard, emptyBlockValue, boardWidth, boardHeight) {

    console.log('_prepareBoard() called', this.props)
    let initialBoardData = this._prepareInitialBoard(shuffledBoard, emptyBlockValue);
    let solvedAndSetBoard = this._prepareSolvedAndSetBoard(solvedBoard, emptyBlockValue);

    const { initialBoard, emptyBlockIdx } = initialBoardData;

    const currentBoard = initialBoard;

    let positionalBoard = this._preparePositional2DBoard(initialBoard, boardWidth, boardHeight);

    console.log('preparing board called with' +
                // 'board = ', board,
                'current board = ', currentBoard,
                'positional board = ', positionalBoard,
                'initalBoard = ', initialBoard

      );


    // let board = shuffledBoard.slice();
    let board = currentBoard.slice();

    const boardSolvable = this._boardSolvable(board, boardWidth, boardHeight, positionalBoard);

    console.log('board solvable = ', boardSolvable)
    // reset board if it's not solvable
    if (!boardSolvable) {
      console.log('called again')
      store.dispatch(resetBoard())
      console.log('CALLING AGAIN -> ')
      this._setBoard(boardWidth, boardHeight)
    }

    console.log('GOT HERE 1111222, ', emptyBlockIdx, emptyBlockValue)
    return { initialBoard, currentBoard, positionalBoard, solvedAndSetBoard, emptyBlockIdx, emptyBlockValue, boardWidth, boardHeight };
  }

  _boardSolvable (board, width, height, positionalBoard) {
    const inversions = this._countInversions(board);
    console.log('TOTAL number of inversions = ', inversions)


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


  _countInversions (board) {
    console.log('counting inversions with board = ', board)
    let inversionsFound = 0;
    sort(board);
    console.log('inversions found here ')
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

    return { initialBoard, emptyBlockIdx }
  }

  _checkIfBlockIsAdjacent(targetPositionValue, positionalBoard) {
    let emptyBlock;
    let targetBlock;
    let acceptableXPosition;
    let acceptableYPosition;
    let adjacent;
    let targetPositionValueInt = parseInt(targetPositionValue, 10);

    positionalBoard.forEach((board, boardIdx) => {
      board.forEach(ref => {
        console.log('ref = ', ref);
        console.log('ref value = ', ref.value);

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

  _checkIfBlockCanBeMoved(targetPositionValue, positionalBoard, emptyPosition) {
    const { adjacent, emptyBlock, targetBlock } = this._checkIfBlockIsAdjacent(targetPositionValue, positionalBoard);
    let canBeMoved = this._checkIfPositionCanBeMoved(emptyPosition);
    let positionCanBeMoved;

    if (adjacent && canBeMoved) {
      positionCanBeMoved = true;
      return {positionCanBeMoved, emptyBlock, targetBlock }
    } else {
      positionCanBeMoved = false;
      return {positionCanBeMoved, emptyBlock, targetBlock }
    }
  }

  _checkIfPositionCanBeMoved(emptyPosition) {
    return !emptyPosition.is(':empty')
  }

  _handleBlockClick (e) {
    const { boards } = this.props.currentGame;
    const positionalBoard =  boards.positionalBoard;
    const solvedBoard = boards.solvedBoard;
    const currentBoard = boards.currentBoard;

    let target = "#" + e.target.id;

    let targetPosition = $(target);
    let emptyPosition = $('#empty');

    let targetPositionValue = targetPosition.text();

    const {positionCanBeMoved, emptyBlock, targetBlock} = this._checkIfBlockCanBeMoved(targetPositionValue, positionalBoard, emptyPosition);

    if (!positionCanBeMoved) {
      store.dispatch(blockMoveNotAllowed({ targetPositionValue }));
      return
    }

    store.dispatch(blockMoved({ emptyBlock, targetBlock }));
    this._checkIfPuzzleSolved(currentBoard, solvedBoard)
  }

  _checkIfPuzzleSolved (currentBoard, solvedBoard) {
    const arraysEqual = this._arraysEqual(currentBoard, solvedBoard);

    if (arraysEqual) {
      store.dispatch(puzzleSolved())
    }
  }


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
