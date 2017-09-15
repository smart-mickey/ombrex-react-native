import createReducer from '../../lib/createReducer'
import * as types from '../actions/types'


export const app_state = createReducer('',{
    [types.WELCOME](state, action){
        return 'App started';
    }
})

export const userInfo = createReducer({},{
    [types.USER_INFO](state, action){
        return action.data;
    }
})

export const contacts = createReducer([],{
    [types.USER_CONTACTS](state, action){
        return action.contacts;
    }
})

export const loadingContact = createReducer(false,{
    [types.LOADING_CONTACT](state, action){
        return action.state;
    }
})


