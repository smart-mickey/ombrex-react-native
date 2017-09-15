import * as types from './types'
import {Actions} from 'react-native-router-flux'
import { Platform, AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';
var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync : {
    }
})	
export const onCall = (pNumber, userInfo, callback) => {
    return (dispatch, getState) => {
        let body = {
            called_number: pNumber
        }
        fetch(types.URL_CALL, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'Api-Version': 1,
                'Authorization': 'Bearer ' + userInfo.access_token
            },
            body: JSON.stringify(body)
        })
        .then((response) => {
            if(response.ok){
                return response.json()
            }
            else if(response.status == 401){
                callback('Unauthorized')
            }
            else{
                callback('Some server error')
            }
        })
        .then((result) => {
            console.log('call request state: ', JSON.stringify(result));
            callback(result.proxy_number)
        })
        .catch((error) => {
            callback('error')
        });
    }
}

export const Logout = () => {
    return (dispatch, getState) => {
        storage.remove({
            key: 'myaccount'
        });
        Actions.popTo('Login')
    }
}

export const getVoiceMailInTimer = (user, callback) => {
    return (dispatch, getState) => {
        setInterval(function(){
            dispatch(voiceMailTimer(user, (result)=>{callback(result)}))
        }, 5000);
    }
}

export const voiceMailTimer = (user, callback) => {
    return (dispatch, getState) => {
        fetch(types.URL_VOICE_MAIL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Api-Version': 1,
                'Authorization': 'Bearer ' + user.access_token
            }
        })
        .then((response) => {
            if(response.status == 401){
                callback('Unauthorized')
            }
            else{
                return response.json()
            }
        })
        .then((result) => {
            dispatch(saveBadge(result.new_messages))
            callback(result)
        })
        .catch((error) => {
            callback('error')
        });
    }
}   

export const getVoiceMails = (user, callback) => {
    return (dispatch, getState) => {
        fetch(types.URL_VOICE_MESSAGE, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Api-Version': 1,
                'Authorization': 'Bearer ' + user.access_token
            }
        })
        .then((response) => {
            if(response.status == 401){
                callback('Unauthorized')
            }
            else{
                return response.json()
            }
        })
        .then((result) => {
            dispatch(setMsg(result))
            callback('success')
        })
        .catch((error) => {
            callback('error')
        });
    }
}   

export const setMsg = (msg) => {
    return{
        type: types.ALL_MESSAGES,
        msg
    }
}

export const getCallHistories = (user, callback) => {
    return (dispatch, getState) => {
        fetch(types.URL_CALL_HISTORY, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Api-Version': 1,
                'Authorization': 'Bearer ' + user.access_token
            },
        })
        .then((response) => {
            if(response.status == 401){
                callback('Unauthorized')
            }
            else{
                return response.json()
            }
        })
        .then((data) => {
            console.log('call histories: ', JSON.stringify(data));
            dispatch(setCallHistory(data))
            return callback('success')            
        })
        .catch((error) => {
            callback('error')
        });
    }
}

export const setCallHistory = (history) => {
    return{
        type: types.CALL_HISTORY,
        history
    }
}

export const saveBadge = (badge) => {
    return{
        type: types.NEW_MESSAGES,
        badge
    }
}

export const deleteVoiceMail = (id, user, callback) => {
    return (dispatch, getState) => {
        fetch(types.URL_DELETE_MAIL + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Api-Version': 1,
                'Authorization': 'Bearer ' + user.access_token
            },
        })
        .then((response) => {
            if(response.status == 401){
                callback('Unauthorized')
            }
            else{
                return response.json()
            }
        })
        .then((data) => {
            alert(JSON.stringify(data));
            return callback('success')            
        })
        .catch((error) => {
            callback('error')
        });
    }
}