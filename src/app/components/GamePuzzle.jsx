import React from 'react';
import { connect } from 'react-redux';
import Block from './Block';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// check if puzzle is solvable
// if not solvable reinitialized new puzzle



import store from '../store';
import { setBoard, blockClicked } from '../actions/game-puzzle-actions';

class GamePuzzle extends React.Component {

  constructor (props) {
    super(props);

  }

  componentWillMount () {

  }

  componentDidMount () {
    const { boardWidth } = this.props.currentGame;
    const initialBoardDetails = this._setBoard(boardWidth);

    // update the state with the same parameters no matter what
    store.dispatch(setBoard(initialBoardDetails));
  }

  // 1. for state - see componentDidMount
  // 2. for UI

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

  _setBoard(boardWidth) {

    let totalNumberOfBlocks = boardWidth * boardWidth;

    const shuffledBoard = this.shuffleBoard([...Array(totalNumberOfBlocks).keys()].map(i => i + 1));
    const solvedBoard = [...Array(totalNumberOfBlocks).keys()].map(i => i + 1);
    const emptyBlockValue = this._getRandomIdx(1, totalNumberOfBlocks);

    const arraysEqual = this._arraysEqual(solvedBoard, shuffledBoard);

    if (arraysEqual) {
      this._setBoard(boardWidth)
    }

    return this._prepareBoard(solvedBoard, shuffledBoard, emptyBlockValue, boardWidth)
  }

  _prepareMultiDimensionalBoard(board, boardWidth) {
    let multidimensionalBoard;
    let arr1 = []

    for (var b = 0; b < boardWidth; b++) {


      let arr2 = new Array(boardWidth);

      for (var j = 0; j < arr2.length; j++ ) {
        arr2.push({x: 'hi', y: ''})
      }


      arr1.push(arr2)
    }

    console.log('prepareMultiDimensionalBoard = arr1 ', arr1)
    console.log('prepareMultiDimensionalBoard = arr2 ', arr2)

  }

  _prepareBoard (solvedBoard, shuffledBoard, emptyBlockValue, boardWidth) {

    let initialBoardData = this._prepareInitialBoard(shuffledBoard, emptyBlockValue);
    let solvedAndSetBoard = this._prepareSolvedAndSetBoard(solvedBoard, emptyBlockValue);

    const { initialBoard, emptyBlockIdx } = initialBoardData;

    let multidimensionalBoard = this._prepareMultiDimensionalBoard(initialBoard, boardWidth)

    return {solvedAndSetBoard, initialBoard, emptyBlockIdx, emptyBlockValue };
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

  // check if move can be made
  // if move can be made, make move
  // if not don't do anything and log it to the user
  // after the move is made, check the board
  _handleBlockClick (e) {
    console.log('_handleBlockClick');

    let selectedBlockId = "#" + e.target.id;

    console.log('selected block with id ', selectedBlockId)

    let oldPosition = $(selectedBlockId);
    let newPosition = $('#empty');

    let oldPositionClone = oldPosition.clone(true, true);
    let newPositionClone = newPosition.clone(true, true);

    console.log('oldPosition Clone  =', oldPositionClone)

    console.log('newPosition Clone  =', newPositionClone)

    console.log('meets condition ?? ', !newPosition.is(':empty'))

    if (!newPosition.is(':empty')) {
      console.log('can move')
      oldPosition.replaceWith(newPositionClone);
      newPosition.replaceWith(oldPositionClone);

      // oldPosition.addClass('replaced')
    } else {
      console.log('not empty ')

    }
    // dispatch an event that triggers game board reinitialization
    store.dispatch(blockClicked(e.target))
  }


  render () {
    console.log('render for game puzzle with props ', this.props );
    const {boardWidth, currentBoard, emptyBlock, minNumMovesForWin} = this.props.currentGame
    let puzzleBlocks = [];
    let id, value;
    const type = "type-" + boardWidth + "x" + boardWidth;


    currentBoard.forEach((block, idx) => {
      if (idx === emptyBlock.initialIndex) {
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
