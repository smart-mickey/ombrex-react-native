import { combineReducers } from 'redux';
import * as loginReducer from './login'
import * as homeReducer from './home'

export default combineReducers(Object.assign(
  loginReducer,
  homeReducer
));
