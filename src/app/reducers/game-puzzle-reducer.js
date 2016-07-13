import * as types from '../actions/action-types';
import _ from 'lodash';

const initialState = {
  blockSqRt: 3,
  puzzleBlocks: [],
  numMovesAlreadyMade: 0,
  minNumMovesForWin: 0
};

const gamePuzzleReducer = function(state = initialState, action) {

  console.log('gamePuzzleReducer() ')
  console.log('state = ', state)
  console.log('action = ', action)

  switch(action.type) {

    // set initial board state, sets puzzle blocks
    case types.SET_BOARD:
      state = Object.assign({}, state);
      
    case types.BLOCK_CLICKED:
      // console.log('set board reducer called, ', action)
      // console.log('state = ', state)
      state = Object.assign({}, state, {
        blockSqRt: state.blockSqRt,
        puzzleBlocks: state.puzzleBlocks,
        numMovesAlreadyMade: state.numMovesAlreadyMade + 1,
        // minNumMovesForWin: action.data.movesForWin
      });
      break;


  }

  return state;

}

export default gamePuzzleReducer;
