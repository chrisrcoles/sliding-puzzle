import * as types from '../actions/action-types';

const initialState = {
  receivedBoardDetails: false,
  resetBoard: false,
  width: 3,
  height: 3
};

const gameDetailsReducer = function(state = initialState, action) {

  switch(action.type) {

    case 'PAGE_MOUNT':
      console.log('page mount reducer called', action);
      return Object.assign({}, state)
      break;

    case types.GET_BOARD_DETAILS:
      return Object.assign({}, state, {
        receivedBoardDetails: true
      });
      break;

    case types.RESET_BOARD_D:
      return Object.assign({}, state, {
        resetBoard: true
      });
      break;

    case types.UPDATE_VALUE:
      let width, height;
      const input = action.data.input;
      const value = input.value;
      const type = input.type;
      
      var width = (type === "width") ? value : state.width;
      var height = (type === "height") ? value : state.height;

      return Object.assign({}, state, { height, width })
  }

  return state;
};

export default gameDetailsReducer;
