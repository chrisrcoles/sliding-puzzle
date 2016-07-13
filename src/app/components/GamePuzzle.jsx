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

    this.initialBoard = [];
    this.solvedBoard = [];

  }

  componentWillMount () {
    store.dispatch({type: 'PAGE_MOUNT'})
  }

  componentDidMount () {
    console.log('component mounted with props', this.props)
    const {blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin} = this.props.currentGame

    // update the state with the same parameters no matter what
    store.dispatch(setBoard(blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin));
  }

  // 1. for state - see componentDidMount
  // 2. for UI
  _setPuzzle(blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin) {

    return this._setInitialBoard(blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin);
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

  _setInitialBoard(blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin) {
    // console.log('blockSqRt', blockSqRt)
    // console.log('puzzleBlocks', puzzleBlocks)
    // console.log('numMovesAlreadyMade', numMovesAlreadyMade)
    // console.log('minNumMovesForWin', minNumMovesForWin)
    let totalNumberOfBlocks = blockSqRt * blockSqRt;
    let initialBoard = [...Array(totalNumberOfBlocks).keys()].map(i => i + 1);

    // shuffle
    let shuffledBoard = this.shuffleBoard([...Array(totalNumberOfBlocks).keys()].map(i => i + 1));

    let arraysEqual = this._arraysEqual(initialBoard, shuffledBoard);

    // if arrays are the same then call reshuffle
    if (arraysEqual) {
      console.log('arrays were the same')
      this._setInitialBoard(blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin)
    }

    this.initialBoard = shuffledBoard;
    this.solvedBoard = initialBoard;


    console.log('BOARD = ', initialBoard)
    console.log('Shuffled Board = ', shuffledBoard)

    console.log('arrays equal = ', arraysEqual)
    const emptyBlockValue = this._getRandomIdx(1, totalNumberOfBlocks);

    console.log('Empty Block Value = ', emptyBlockValue)
    const type = "type-" + blockSqRt + "x" + blockSqRt;

    let puzzleBoard = shuffledBoard.map((block, idx) => {
      let id;
      if (block === emptyBlockValue) {
        id = "empty";
      } else {
        id = "block-" + (idx + 1);
      }

      return (
          <Block className={"block " + type}
                 id={id}
                 key={block}
                 value={block}
                 type={type}
                 onBlockClick={(e) => this._handleBlockClick(e)}/>
      )
    });

    return puzzleBoard;
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

    let oldPositionClone = oldPosition.clone();
    let newPositionClone = newPosition.clone();

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

  _resetBoard (blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin) {
    throw new Error(
      'Needs to be implemented'
    )
  }

  render () {
    console.log('render for game puzzle with props ', this.props )
    const {blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin} = this.props.currentGame
    let puzzle = this._setPuzzle(blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin);

    return (
      <section className="game-puzzle">
        <div className="puzzle-blocks">
          {puzzle}
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
