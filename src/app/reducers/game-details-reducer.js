import * as types from '../actions/action-types';

const initialState = {
  searchType: '',
  title: ''
};

const gameDetailsReducer = function(state = initialState, action) {

  switch(action.type) {
    
    case 'PAGE_MOUNT':
      console.log('page mount reducer called', action);
      return Object.assign({}, state)

  }

  return state;

}

export default gameDetailsReducer;
