import * as types from '../actions/action-types';
import _ from 'lodash';

const initialState = {
  boardWidth: 3,
  boardHeight: 3,
  maxHeight: 5,
  maxWidth: 5,
  emptyBlockIdx: null,
  boards: {
    initialBoard: [],
    currentBoard: [],
    solvedBoard: [],
    positionalBoard: []
  },
  timer: {
    start: null,
    elapsed: 0
  },
  numMovesAlreadyMade: 0,
  boardSolved: false,
  error: null
};

const gamePuzzleReducer = function(state = initialState, action) {

  console.log('Game Puzzle Reducer() ');
  console.log('hey')
  console.log('incoming aØction = ', action);

  switch(action.type) {

    case types.SET_BOARD:
      let boardDetails = action.data.boardDetails;

      console.log('state board width ', state.boardWidth)
      console.log('width = ', action.data.boardWidth)

      let width = action.data.boardDetails.boardWidth ? action.data.boardDetails.boardWidth : state.boardWidth;
      let height = action.data.boardDetails.boardHeight ? action.data.boardDetails.boardHeight : state.boardHeight;

      console.log('width in action ', width)
      console.log('height in action ', height)

      state = Object.assign({}, state, {
        numMovesAlreadyMade: 0,
        emptyBlockIdx: boardDetails.emptyBlockIdx,
        boards: {
          initialBoard: boardDetails.initialBoard,
          solvedBoard: boardDetails.solvedAndSetBoard,
          positionalBoard: boardDetails.positionalBoard,
          currentBoard: boardDetails.currentBoard
        },
        boardWidth: width,
        boardHeight: height
      });
      break;

    case types.UPDATE_VALUE:
      const input = action.data.input;

      const value = input.value;
      const type = input.type;

      let boardWidth = (type === "boardWidth") ? value : state.width;
      let boardHeight = (type === "boardHeight") ? value : state.height;

      return Object.assign({}, state, { boardWidth, boardHeight });

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
      break;

    // re initialize state as empty
    case types.RESET_BOARD:
      console.log('reset board reducer called!!', state)
      state = Object.assign({}, state, {
        emptyBlockIdx: null,
        boards: {
          initialBoard: [],
          currentBoard: [],
          solvedBoard: [],
          positionalBoard: []
        },
        numMovesAlreadyMade: 0,
        boardSolved: false,
        error: null
      });
      break;

    case types.UPDATE_TIMER:
      state = Object.assign({}, state, {
        timer: {
          start: action.data.timer.start,
          elapsed: action.data.timer.elapsed
        }
      })
      break;

    case types.ALERT_CLIENT_ERROR:
      console.log('action data error ', action.data.error);
      const error = action.data.error
      state = Object.assign({}, state, {
        error: error
      });
      break;

  }


  return state;
};

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
