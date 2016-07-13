import React from 'react';
import { connect } from 'react-redux';
import Block from './Block';

import store from '../store';
import { setBoard, blockClicked } from '../actions/game-puzzle-actions';

class GamePuzzle extends React.Component {

  constructor (props) {
    super(props);

    this.board = null;

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
    let board;

    if (!numMovesAlreadyMade) {
      console.log('no moves mad set initial board');
      board = this._setInitialBoard(blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin);
    } else {
      console.log('moves already mad, repoisitioning board');
      board = this._resetBoard(blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin);
    }

    return board;
  }

  _getRandomIdx (low, high) {
    return Math.floor(Math.random() * (high - low)) + low;
  }

  _setInitialBoard(blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin) {
    // console.log('blockSqRt', blockSqRt)
    // console.log('puzzleBlocks', puzzleBlocks)
    // console.log('numMovesAlreadyMade', numMovesAlreadyMade)
    // console.log('minNumMovesForWin', minNumMovesForWin)
    let id, puzzleBoard, offsetBlock;
    let totalNumberOfBlocks = blockSqRt * blockSqRt;

    // shuffle
    let shuffledBoard = this.shuffleBoard([...Array(totalNumberOfBlocks).keys()]);
    const randomBlockIdx = this._getRandomIdx(1, totalNumberOfBlocks);
    const type = "type-" + blockSqRt + "x" + blockSqRt;

    puzzleBoard = shuffledBoard.map((block, idx) => {
      offsetBlock = block + 1;

      if (offsetBlock === randomBlockIdx) {
        id = "empty";
      } else {
        id = "block-" + (idx + 1);
      }

      return (
        <Block id={id}
               key={offsetBlock}
               value={offsetBlock}
               type={type}
               onBlockClick={(e) => this._handleBlockClick(e)}/>
      )
    });

    return puzzleBoard;
  }

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



  _handleBlockClick (e) {
    console.log('block clicked', e.target)
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
  console.log('mapStateTop Props with store = ', state)
  return {
    currentGame: state.gamePuzzleState
  }
};

export default connect(mapStateToProps)(GamePuzzle);
