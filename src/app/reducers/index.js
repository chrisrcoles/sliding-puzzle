import { combineReducers } from 'redux';

// Reducers
import gameDetailsReducer from './game-details-reducer';
import gamePuzzleReducer from './game-puzzle-reducer';

// Combine Reducers
var reducers = combineReducers({
    gameDetailsState: gameDetailsReducer,
    gamePuzzleState: gamePuzzleReducer
});

export default reducers;
