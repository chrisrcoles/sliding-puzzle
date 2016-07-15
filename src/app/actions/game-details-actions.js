import * as types from '../actions/action-types';

export function getBoardDetails () {
  console.log('getBoardDetails() action');

  return {
    type: types.GET_BOARD_DETAILS,
    data: {}
  };
}

export function resetBoard () {
  
  return {
    type: types.RESET_BOARD_D,
    data: {}
  }
}

export function updateValue (input ) {
  
  return {
    type: types.UPDATE_VALUE,
    data: { input }
  }
}
