import * as types from '../actions/action-types';
import _ from 'lodash';

const initialState = {
  blockSqRt: 3,
  initialBoard: [],
  currentBoard: [],
  solvedBoard: [],
  emptyBlock: {},
  numMovesAlreadyMade: 0,
  boardSolved: false
};

const gamePuzzleReducer = function(state = initialState, action) {

  console.log('gamePuzzleReducer() ')
  console.log('state = ', state)
  console.log('action = ', action)

  switch(action.type) {

    // set initial board state, sets puzzle blocks
    case types.SET_BOARD:
      let currentBoard;
      let initialBoardDetails = action.data.initialBoardDetails;

      if (!state.initialBoard.length) {
        console.log('first set of set board')
        currentBoard = initialBoardDetails.initialBoard
      } else {
        currentBoard = state.currentBoard
      }
      state = Object.assign({}, state, {
        initialBoard: initialBoardDetails.initialBoard,
        emptyBlock: {
          initialValue: initialBoardDetails.emptyBlockValue,
          initialIndex: initialBoardDetails.emptyBlockIdx
        },
        numMovesAlreadyMade: 0,
        solvedBoard: initialBoardDetails.solvedAndSetBoard,
        currentBoard: currentBoard
      });
      break;

    case types.BLOCK_CLICKED:
      console.log('set board block clicked reducer called, ', action)
      // console.log('state = ', state)
      state = Object.assign({}, state, {
        blockSqRt: state.blockSqRt,
        numMovesAlreadyMade: state.numMovesAlreadyMade + 1,
        // minNumMovesForWin: action.data.movesForWin
      });
      break;


  }

  return state;

}

export default gamePuzzleReducer;
