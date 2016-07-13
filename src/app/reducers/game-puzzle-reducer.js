import * as types from '../actions/action-types';
import _ from 'lodash';

const initialState = {
  blockSqRt: 2,
  puzzleBlocks: [],
  numMovesAlreadyMade: 0,
  minNumMovesForWin: 0
};

const gamePuzzleReducer = function(state = initialState, action) {

  console.log('gamePuzzleReducer() ')
  console.log('state = ', state)
  console.log('action = ', action)

  switch(action.type) {

    case types.SET_BOARD:
      console.log('set board reducer called, ', action)
      state = Object.assign({}, state);


  }

  return state;

}

export default gamePuzzleReducer;
