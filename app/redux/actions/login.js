import * as types from './types'
import { Platform, AsyncStorage } from 'react-native';
import {Actions} from 'react-native-router-flux'
var Contacts = require('react-native-contacts')
export const welcome = () => {
    return {
        type: types.WELCOME,
    }
}

export const login = (email, pass, mobile, callback) => {
    return (dispatch, getState) => {
        let body = {}
        let regExp = /^\+?\d{10,14}$/
        let number = '12456789123'
        // let email = 'demoapp1@example.com'
        // let pass = 'ombrex123'
        // let mobile = '+16470001234'
        //alert('number'.match(regExp))
        if(validateEmail(email)){
            body = {
                email: email,
                password: pass,
                mobile_number: mobile
            }
        }
        else if(!mobile.match("^\\+?((?:1){10})$") || 1){
            body = {
                phone_number: email,
                password: pass,
                mobile_number: mobile
            }
        }
        else{
            callback('invalid')
        }
        // if(!mobile.match("^\\+?((?:1){10})$")){
        //     return callback('invalid')
        // }
        fetch(types.URL_LOGIN, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((userJson) => {
            if(userJson.info == 'otp required'){
                callback('OTP')
            }
            else if(userJson.access_number == undefined){
                callback('Invalid Credientals')
            }
            else {
                dispatch(setUserInfo(userJson))
                dispatch(saveAccessNumber(userJson.access_number))
                callback('success')       
            }
                 
        })
        .catch((error) => {
            callback('Network error')
        });
    }
}

export const confirmOTP = (email, pass, mobile, OTP, callback) => {
    return (dispatch, getState) => {
        fetch(types.URL_LOGIN, {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: pass,
                mobile_number: mobile,
                otp: OTP
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.access_number == undefined){
                callback('invalid')
            }
            else{
                dispatch(setUserInfo(data))
                dispatch(saveAccessNumber(data.access_number))
                callback('success')  
            }
                         
        })
        .catch((error) => {
            callback('Network error')
        });
    }
}

export const setUserInfo = (data) => {
    return{
        type: types.USER_INFO,
        data
    }
}

export const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
};

export const getUserContacts = (callback) => {
    return (dispatch, getState) => {
        Contacts.getAll((err, contacts) => {
            if(err === 'denied'){
                // error
                alert("Access to contact list is denied.")
            } else {
                const sortedContacts = contacts.sort(sort_by('givenName', false, function(a){return a.toUpperCase()}));
                dispatch(saveContactDatas(sortedContacts))    
                callback()
            }
        })
    }
}

export const sort_by = (field, reverse, primer) => {

    var key = primer ? 
        function(x) {return primer(x[field])} : 
        function(x) {return x[field]};

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    } 
}

export const saveAccessNumber = (AN) => {//save access_number into contact list
    return (dispatch, getState) => {
        Contacts.getContactsMatchingString("Ombrex", (err, contacts) => {
            if(err === 'denied'){
                // x.x
            } else {
                // Contains only contacts matching "filter"
                console.log('filtered contacts', contacts)
                if(contacts.length == 0){
                    
                    let newContact = {
                        phoneNumbers: [{
                            label: "Via Ombrex",
                            number: AN,
                        }],
                        hasThumbnail: true,
                        thumbnailPath: '../../resources/image/icon_gray.jpg',
                        familyName: "",
                        givenName: "Ombrex",
                    }
                    Contacts.addContact(newContact, (err) => { /*...*/ })
                }
                else{
                    let temp = []
                    contacts[0].phoneNumbers.map(function(item, index){
                        if(item.number.indexOf(',') < 0) temp.push(item)
                    })
                    temp.push({
                        label: "Via Ombrex",
                        number: AN,
                    })
                    Contacts.deleteContact(contacts[0], (err) => { /*...*/ })
                    let newContact = {
                        phoneNumbers: temp,
                        hasThumbnail: true,
                        thumbnailPath: '../../resources/image/icon_gray.jpg',
                        familyName: "",
                        givenName: "Ombrex",
                    }
                    Contacts.addContact(newContact, (err) => { /*...*/ })
                }
                Actions.Home()
            }
        })
    }
}

export const saveProxyNumber = (number) => {
    return (dispatch, getState) => {
        Contacts.getContactsMatchingString("Ombrex", (err, contacts) => {
            if(err === 'denied'){
                // x.x
            } else {
                if(contacts.length == 0){
                    let newContact = {
                        phoneNumbers: [{
                            label: "Via Ombrex",
                            number: number,
                        }],
                        hasThumbnail: true,
                        thumbnailPath: '../../resources/image/icon_gray.jpg',
                        familyName: "",
                        givenName: "Ombrex",
                    }
                    Contacts.addContact(newContact, (err) => { /*...*/ })
                }
                else if(JSON.stringify(contacts[0].phoneNumbers).indexOf(number) < 0){
                    let temp = []
                    contacts[0].phoneNumbers.map(function(item, index){
                        if(item.number.indexOf(',') < 0) temp.push(item)
                    })
                    temp.push({
                        label: "Via Ombrex",
                            number: number,
                    })
                    Contacts.deleteContact(contacts[0], (err) => { /*...*/ })
                    let newContact = {
                        phoneNumbers: temp,
                        hasThumbnail: true,
                        thumbnailPath: '../../resources/image/icon_gray.jpg',
                        familyName: "",
                        givenName: "Ombrex",
                    }
                Contacts.addContact(newContact, (err) => { /*...*/ })

                }
                else{}
                dispatch(getUserContacts(()=>{}))
            }
        })
    }
}

export const saveContactDatas = (contacts) => {
    return{
        type: types.USER_CONTACTS,
        contacts
    }
}