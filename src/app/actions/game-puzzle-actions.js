import * as types from '../actions/action-types';

export function setBoard (initialBoardDetails) {
  console.log('setBoard() action');

  return {
    type: types.SET_BOARD,
    data: { initialBoardDetails }
  };
}


export function blockClicked (block) {
  console.log('blockClicked() action');

  return {
    type: types.BLOCK_CLICKED,
    data: { block }
  }

}