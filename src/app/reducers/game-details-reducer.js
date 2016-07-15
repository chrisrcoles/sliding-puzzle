import * as types from '../actions/action-types';

const initialState = {
  receivedBoardDetails: false,
  resetBoard: false
};

const gameDetailsReducer = function(state = initialState, action) {
  console.log('REDUCER GOR GAME DETAILS')

  switch(action.type) {
    
    case 'PAGE_MOUNT':
      console.log('page mount reducer called', action);
      return Object.assign({}, state);
      break;

    case types.RESET_BOARD_D:
      return Object.assign({}, state, {
        resetBoard: true
      });
      break;
    
  }

  return state;
};

export default gameDetailsReducer;
