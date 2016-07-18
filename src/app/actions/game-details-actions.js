import * as types from '../actions/action-types';

export function resetBoard () {
  return {
    type: types.RESET_BOARD_D,
    data: {}
  }
}

export function requestHint () {
  return {
    type: types.REQUEST_HINT,
    data: {}
  }
}

export function receivedHint(hint) {
  return {
    type: types.RECEIVED_HINT,
    data: { hint }
  }
}