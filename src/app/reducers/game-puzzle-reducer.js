import * as types from '../actions/action-types';
import _ from 'lodash';

const initialState = {
  boardWidth: 3,
  boardHeight: 3,
  emptyBlockIdx: null,
  boards: {
    initialBoard: [],
    currentBoard: [],
    solvedBoard: [],
    positionalBoard: []
  },
  numMovesAlreadyMade: 0,
  boardSolved: false
};

const gamePuzzleReducer = function(state = initialState, action) {

  console.log('Game Puzzle Reducer() ');
  console.log('incoming action = ', action);

  switch(action.type) {

    case types.SET_BOARD:
      let currentBoard;
      let boardDetails = action.data.boardDetails;

      if (!state.boards.initialBoard.length) {
        currentBoard = boardDetails.initialBoard
      } else {
        currentBoard = state.currentBoard
      }

      state = Object.assign({}, state, {
        numMovesAlreadyMade: 0,
        emptyBlockIdx: boardDetails.emptyBlockIdx,
        boards: {
          initialBoard: boardDetails.initialBoard,
          solvedBoard: boardDetails.solvedAndSetBoard,
          positionalBoard: boardDetails.positionalBoard,
          currentBoard: currentBoard
        }
      });
      break;

    case types.BLOCK_MOVED:
      state = _getStateForBlockMoved(state, action);
      break;

    case types.BLOCK_MOVE_NOT_ALLOWED:
      console.log('BLOCK CLICK NOT ALLOWED');
      state = Object.assign({}, state);
      break;

    case types.PUZZLE_SOLVED:
      state = Object.assign({}, state, {
        boardSolved: true
      })

  }

  console.log('set state = ', state);
  return state;

}

const _getStateForBlockMoved = function (state, action) {
  const { targetBlock, emptyBlock } = action.data.blocks;
  const currentBoard = state.boards.currentBoard.slice();
  const positionalBoard = state.boards.positionalBoard.slice();

  let targetBlockValue = targetBlock.ref.value;
  let emptyBlockValue = emptyBlock.ref.value;

  let targetBlock2DArrayIdx = targetBlock.boardIdx;
  let emptyBlock2DArrayIdx = emptyBlock.boardIdx;

  let targetBlockOldArrIdx = currentBoard.indexOf(targetBlockValue);
  let emptyBlockOldArrIdx = currentBoard.indexOf(emptyBlockValue);

  let targetBlockIdxInNestedPositionalArray;
  let emptyBlockIdxInNestedPositionalArray;

  let temp = currentBoard[targetBlockOldArrIdx];

  // update current board
  currentBoard[targetBlockOldArrIdx] = currentBoard[emptyBlockOldArrIdx];
  currentBoard[emptyBlockOldArrIdx] = temp;

  positionalBoard[targetBlock2DArrayIdx].forEach((block, idx) => {
    if (block.value === targetBlockValue) {
      targetBlockIdxInNestedPositionalArray = idx
    }
  });

  positionalBoard[emptyBlock2DArrayIdx].forEach((block, idx) => {
    if (block.value === emptyBlockValue) {
      emptyBlockIdxInNestedPositionalArray = idx
    }
  });

  // update positional board
  positionalBoard[targetBlock2DArrayIdx][targetBlockIdxInNestedPositionalArray] = {
    x: targetBlock.ref.x,
    y: targetBlock.ref.y,
    value: emptyBlock.ref.value
  };
  positionalBoard[emptyBlock2DArrayIdx][emptyBlockIdxInNestedPositionalArray] = {
    x: emptyBlock.ref.x,
    y: emptyBlock.ref.y,
    value: targetBlock.ref.value
  };

  return Object.assign({}, state, {
    numMovesAlreadyMade: state.numMovesAlreadyMade + 1,
    emptyBlockIdx: targetBlockOldArrIdx,
    boards: {
      positionalBoard: positionalBoard,
      currentBoard: currentBoard,
      initialBoard: state.boards.initialBoard,
      solvedBoard: state.boards.solvedBoard
    }
  })

};

export default gamePuzzleReducer;
