import React from 'react';
import { connect } from 'react-redux';
import Block from './Block';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// check if puzzle is solvable
// if not solvable reinitialized new puzzle



import store from '../store';
import { setBoard, blockMoved, blockMoveNotAllowed, puzzleSolved } from '../actions/game-puzzle-actions';

class GamePuzzle extends React.Component {

  constructor (props) {
    super(props);

  }

  componentWillMount () {}

  componentDidMount () {
    const { boardWidth, boardHeight } = this.props.currentGame;
    const boardDetails = this._setBoard(boardWidth, boardHeight);

    // update the state with the same parameters no matter what
    store.dispatch(setBoard(boardDetails));
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
  // Fisher-Yates for more robust randomizing algo
  shuffleBoard (array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
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

    let totalNumberOfBlocks = boardWidth * boardHeight;

    const shuffledBoard = this.shuffleBoard([...Array(totalNumberOfBlocks).keys()].map(i => i + 1));
    const solvedBoard = [...Array(totalNumberOfBlocks).keys()].map(i => i + 1);
    const emptyBlockValue = this._getRandomIdx(1, totalNumberOfBlocks);

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

    let initialBoardData = this._prepareInitialBoard(shuffledBoard, emptyBlockValue);
    let solvedAndSetBoard = this._prepareSolvedAndSetBoard(solvedBoard, emptyBlockValue);

    const { initialBoard, emptyBlockIdx } = initialBoardData;

    let positionalBoard = this._preparePositional2DBoard(initialBoard, boardWidth, boardHeight)

    return {initialBoard, positionalBoard, solvedAndSetBoard, emptyBlockIdx, emptyBlockValue };
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

    var emptyBlock = b.splice(valueIdx, 1)
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
    let adjacent
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
      console.log('BLOCK CAN BE MOVED IS ADJACENT')
      adjacent = true;
      return {adjacent, emptyBlock, targetBlock }
    } else {
      console.log('BLOCK CANNOT BE MOVED IS NOT ADJACENT')
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
    console.log(emptyPosition, 'emptyPosition')

    if (!emptyPosition.is(':empty')) {
      console.log('BLOCK CAN BE MOVED ', !emptyPosition.is(':empty'), ' IS EMPTY')
    } else {
      console.log('BLOCK CANNOT BE MOVED ', !emptyPosition.is(':empty'), ' IS NOT EMPTY')
    }

    return !emptyPosition.is(':empty')
  }

  // check if move can be made
  // if move can be made, make move
  // if not don't do anything and log it to the user
  // after the move is made, check the board
  _handleBlockClick (e) {
    console.log('_handleBlockClick() called');
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
      console.log('BLOCK CANNOT BE MOVED FOR SOME REASON PLEASE SEE ABOVE');
      store.dispatch(blockMoveNotAllowed({ targetPositionValue }));
      return
    }

    this._replaceBlock(emptyPosition, targetPosition);

    store.dispatch(blockMoved({ emptyBlock, targetBlock }))

    this._checkIfPuzzleSolved(currentBoard, solvedBoard)
  }

  _checkIfPuzzleSolved (currentBoard, solvedBoard) {
    const arraysEqual = this._arraysEqual(currentBoard, solvedBoard);

    if (arraysEqual) {
      store.dispatch(puzzleSolved())
    }
  }


  _replaceBlock(emptyPosition, targetPosition) {
    console.log('empty position = ', emptyPosition);
    console.log('target position = ', targetPosition);

    let oldPositionClone = targetPosition.clone(true);
    let newPositionClone = emptyPosition.clone(true);

    console.log('oldPosition Clone  =', oldPositionClone);
    console.log('emptyPosition Clone  =', newPositionClone);

    targetPosition.replaceWith(newPositionClone);
    emptyPosition.replaceWith(oldPositionClone);
  }


  render () {
    let id, value;
    let puzzleBlocks = [];

    const {boardWidth, boards, emptyBlockIdx, minNumMovesForWin} = this.props.currentGame
    const type = "type-" + boardWidth + "x" + boardWidth;
    let currentBoard = boards.currentBoard;

    currentBoard.forEach((block, idx) => {
      if (idx === emptyBlockIdx) {
        id = "empty"
        value = "."
      } else {
        id = "block-" + (idx + 1)
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

    console.log('render for game puzzle with props ', this.props);
    return (
      <section className="game-puzzle">
        <div className="puzzle-blocks">
          {puzzleBlocks}
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state) => {
  // 2. map state to correct props
  return {
    currentGame: state.gamePuzzleState
  }
};

export default connect(mapStateToProps)(GamePuzzle);
