import * as types from './types'

export const submitResetPassword = (email, mobile, callback) => {
    return (dispatch, getState) => {
        let body = {
            email: email,
            phone_number: mobile
        }
        let regExp = /^\\+?((?:1){10})$/
        //let email = 'demoapp@example.com'
        //let mobile = '+16470001234'
        if(!validateEmail(email)){
            return callback('invalid')
        }
        else if(!mobile.match("^\\+?((?:1){10})$") && 0){
            return callback('invalid')
        }
        // if(!mobile.match("^\\+?((?:1){10})$")){
        //     return callback('invalid')
        // }
        fetch(types.URL_RESET_PASSWORD, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then((user) => user.json())
        .then((userJson) => {
            console.log('reset password state: ', JSON.stringify(userJson));
            return callback('success')            
        })
        .catch((error) => {
            callback('error')
        });
    }
}

export const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
};