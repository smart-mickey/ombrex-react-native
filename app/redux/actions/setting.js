import * as types from './types'

export const getSettingValues = (userInfo, callback) => {
    return (dispatch, getState) => {
        
        fetch(types.URL_SETTING, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Api-Version': 1,
                'Authorization': 'Bearer ' + userInfo.access_token
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
            if(result.call_forwarding == undefined){
                callback('error')
            }            
            else{
                callback(result)
            }
        })
        .catch((error) => {
            callback('error')
        });
    }
}

export const updateSettingValues = (userInfo, mode, number, disturb, callback) => {
    return (dispatch, getState) => {
        let body = {
            call_forwarding: {
                mode: mode?'on':'off',
                number: number
            },
            do_not_disturb: disturb?'on':'off'
        }
        fetch(types.URL_UPDATE_SETTING, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Version': 1,
                'Authorization': 'Bearer ' + userInfo.access_token
            },
            body: JSON.stringify(body)
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
            callback('success')
        })
        .catch((error) => {
            callback('error')
        });
    }
}