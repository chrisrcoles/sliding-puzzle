import * as types from '../actions/action-types';

export function getBoardDetails () {
  console.log('getBoardDetails() action');

  return {
    type: types.GET_BOARD_DETAILS,
    data: {}
  };
}