import * as types from '../actions/action-types';

const initialState = {
  receivedBoardDetails: false,
  resetBoard: false,
  requestingHint: false
};

const gameDetailsReducer = function(state = initialState, action) {

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
        requestingHint: true
      });
    break;

    case types.RECEIVED_HINT:
      return Object.assign({}, state, {
        requestingHint: false,
        hint: action.data.hint.boardSolution,
        hintRequestTime: action.data.hint.elapsed
      });
      break;

  }

  return state;
};

export default gameDetailsReducer;
