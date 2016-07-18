import * as types from '../actions/action-types';

export function setBoard (boardDetails) {
  return {
    type: types.SET_BOARD,
    data: {boardDetails}
  };
}


export function blockMoved (blocks) {
  return {
    type: types.BLOCK_MOVED,
    data: {blocks}
  }

}

export function blockMoveNotAllowed (blockValue) {

  return {
    type: types.BLOCK_MOVE_NOT_ALLOWED,
    data: {blockValue}
  }
}

export function puzzleSolved () {
  return {
    type: types.PUZZLE_SOLVED,
    data: {}
  }

}

export function resetBoard () {
  return {
    type: types.RESET_BOARD,
    data: {}
  }
}

export function updateTimer (timer) {
  return {
    type: types.UPDATE_TIMER,
    data: {timer}
  }
}

export function updateValue (input) {

  return {
    type: types.UPDATE_VALUE,
    data: {input}
  }
}

export function alertClientError (error) {

  return {
    type: types.ALERT_CLIENT_ERROR,
    data: {error}
  }
}