import * as types from '../actions/action-types';

const initialState = {
  receivedBoardDetails: false,
  resetBoard: false,
  hint: {
    requesting: false
  }
};

const gameDetailsReducer = function(state = initialState, action) {
  console.log('REDUCER GOR GAME DETAILS');
  console.log('OLD STATE = ', state);
  console.log('Action = ', action);

  switch(action.type) {

    case 'PAGE_MOUNT':
      return Object.assign({}, state);
      break;

    case types.RESET_BOARD_D:
      return Object.assign({}, state, {
        resetBoard: true
      });
      break;

    case types.REQUEST_HINT:
      return Object.assign({}, state, {
        hint: {
          requesting: true
        }
      })
  }

  console.log('NEW STATE = ', state);
  return state;
};

export default gameDetailsReducer;
