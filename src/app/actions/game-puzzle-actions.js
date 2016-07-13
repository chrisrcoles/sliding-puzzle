import * as types from '../actions/action-types';

export function setBoard (blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin) {
  console.log('setBoard() action');

  return {
    type: types.SET_BOARD,
    data: { blockSqRt, puzzleBlocks, numMovesAlreadyMade, minNumMovesForWin }
  };
}


export function blockClicked (block) {
  console.log('blockClicked() action');

  return {
    type: types.BLOCK_CLICKED,
    data: { block }
  }

}