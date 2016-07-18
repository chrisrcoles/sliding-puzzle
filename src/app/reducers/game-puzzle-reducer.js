import * as types from '../actions/action-types';

const initialState = {
  boardWidth: 3,
  boardHeight: 3,
  maxHeight: 4,
  maxWidth: 4,
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
  console.log('OLD STATE = ', state);
  console.log('ACTION = ', action);

  switch(action.type) {

    case types.SET_BOARD:
      const boardDetails = action.data.boardDetails;
      const width = (boardDetails && boardDetails.boardWidth)
        ? boardDetails.boardWidth : state.boardWidth;
      const height = (boardDetails && boardDetails.boardHeight)
        ? boardDetails.boardHeight : state.boardHeight;

      const emptyIdx = (boardDetails && boardDetails.emptyBlockIdx)
        ? boardDetails.emptyBlockIdx : state.emptyBlockIdx;

      const initialBoard = (boardDetails && boardDetails.initialBoard)
        ? boardDetails.initialBoard : state.boards.initalBoard;

      const solvedAndSetBoard = (boardDetails && boardDetails.solvedAndSetBoard)
        ? boardDetails.solvedAndSetBoard : state.boards.solvedBoard;

      const currentBoard = (boardDetails && boardDetails.currentBoard)
        ? boardDetails.currentBoard : state.boards.currentBoard;

      const positionalBoard = (boardDetails && boardDetails.positionalBoard)
        ? boardDetails.positionalBoard : state.boards.positionalBoard;


      state = Object.assign({}, state, {
        numMovesAlreadyMade: 0,
        emptyBlockIdx: emptyIdx,
        boards: {
          initialBoard: initialBoard,
          solvedBoard: solvedAndSetBoard,
          positionalBoard: positionalBoard,
          currentBoard: currentBoard
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
      state = Object.assign({}, state);
      break;

    case types.PUZZLE_SOLVED:
      state = Object.assign({}, state, {
        boardSolved: true
      });
      break;

    case types.RESET_BOARD:
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
      });
      break;

    case types.ALERT_CLIENT_ERROR:
      console.log('action data error ', action.data.error);
      const error = action.data.error
      state = Object.assign({}, state, {
        error: error
      });
      break;
  }

  console.log('NEW STATE = ', state);
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
