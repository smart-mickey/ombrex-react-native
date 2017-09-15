import createReducer from '../../lib/createReducer'
import * as types from '../actions/types'


export const callHistory = createReducer([],{
    [types.CALL_HISTORY](state, action){
        return action.history;
    }
})

export const badge = createReducer(0,{
    [types.NEW_MESSAGES](state, action){
        return action.badge;
    }
})

export const Msg = createReducer([],{
    [types.ALL_MESSAGES](state, action){
        return action.msg;
    }
})