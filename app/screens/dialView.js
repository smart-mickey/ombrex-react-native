import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import Button from 'apsl-react-native-button'
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import NavigationBar from 'react-native-navbar';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import * as libraries from '../lib/library'
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
var Contacts = require('react-native-contacts')

class DialView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            callNumber: '',
            Progress: false
        }
    }

    deleteDigit() {
        const orig_digits = this.state.callNumber
        if(orig_digits.length == 0) return
        else if(orig_digits.length == 1) this.setState({callNumber: ''})
        else this.setState({callNumber: orig_digits.substring(0, orig_digits.length - 1)})
    }

    addDigit(number) {
        if(this.state.callNumber.length > 11) return
        else if(number == '+' && this.state.callNumber.length<2) this.setState({callNumber: '+'})
        else if(number == 0 && this.state.callNumber == '0') this.setState({callNumber: '+'})
        else if(number != '+') this.setState({callNumber: this.state.callNumber + number.toString()})
    }

    showAlert(title, msg, height) {
        this.setState({alertTitle: title, alertText: msg, alertHeight: height})
        this.popupDialog.show()
    }

    render() {
        const _this = this
        const titleConfig = {
            title: 'DIALER',
            tintColor: 'white',
            style: {
                fontSize: 20,
            }
        };
        return(
            <View style={styles.container}>
                <NavigationBar
                    style = {{backgroundColor: '#222222', height:60}}
                    title = {titleConfig}
                />
                <Spinner visible = {this.state.Progress} textContent="" color='black' />
                <View style={styles.digitView}>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                            <Text style={styles.digitText}>{this.state.callNumber}</Text>
                        </View>
                    </View>
                    <View style={{width: 50}}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                            <TouchableOpacity onPress={() => {this.deleteDigit()}}>
                                <Ionicons name='ios-backspace-outline' color='darkgray' size={40} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{paddingTop: 25}}>
                    <View style={styles.keyboardRow}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit(1)}>
                                <Text style={styles.digitKeyboard}>1</Text>   
                                <Text style={styles.stringKeyboard}> </Text>                             
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit(2)}>
                                <Text style={styles.digitKeyboard}>2</Text>
                                <Text style={styles.stringKeyboard}>ABC</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit(3)}>
                                <Text style={styles.digitKeyboard}>3</Text>
                                <Text style={styles.stringKeyboard}>DEF</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.keyboardRow}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit(4)}>
                                <Text style={styles.digitKeyboard}>4</Text>
                                <Text style={styles.stringKeyboard}>GHI</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit(5)}>
                                <Text style={styles.digitKeyboard}>5</Text>
                                <Text style={styles.stringKeyboard}>JKL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit(6)}>
                                <Text style={styles.digitKeyboard}>6</Text>
                                <Text style={styles.stringKeyboard}>MNO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.keyboardRow}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit(7)}>
                                <Text style={styles.digitKeyboard}>7</Text>
                                <Text style={styles.stringKeyboard}>PQRS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit(8)}>
                                <Text style={styles.digitKeyboard}>8</Text>
                                <Text style={styles.stringKeyboard}>TUV</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit(9)}>
                                <Text style={styles.digitKeyboard}>9</Text>
                                <Text style={styles.stringKeyboard}>WXYZ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.keyboardRow}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit('*')}>
                                <Text style={styles.digitKeyboard}>*</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyboard} delayLongPress={1000} onLongPress={() => this.addDigit('+')} onPress={() => this.addDigit(0)}>
                                <Text style={styles.digitKeyboard}>0</Text>
                                <Text style={styles.stringKeyboard}>+</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyboard} onPress={() => this.addDigit('#')}>
                                <Text style={styles.digitKeyboard}>#</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity style={styles.callButton} 
                        onPress={() => {
                            if(_this.state.callNumber.length > 2){
                                _this.setState({Progress: true})
                                _this.props.onCall(_this.state.callNumber, _this.props.userInfo, (result) => {
                                    _this.setState({Progress: false})
                                    if(result == 'Some server error'){
                                        _this.showAlert('Ombrex - error', result, 100)
                                    }
                                    else if(result == 'Unauthorized'){
                                        _this.showAlert('Ombrex - violation', 'You are unauthorized or your token is expired.', 140)
                                        _this.props.Logout()
                                    }
                                    else if(result == undefined || result == 'error'){
                                        RNImmediatePhoneCall.immediatePhoneCall(libraries.toClearPhoneNumber(_this.props.userInfo.access_number + ',' + _this.state.callNumber));
                                    }
                                    else{
                                        _this.props.saveProxyNumber(result)
                                        RNImmediatePhoneCall.immediatePhoneCall(libraries.toClearPhoneNumber(result));
                                    }
                                })
                            }
                            else{
                                //_this.showAlert('Ombrex - input error', 'Phone number is empty', 100)
                            }
                        }}>
                        <Ionicons name='ios-call' color='white' size={30} />                           
                    </TouchableOpacity>                    
                </View>
                <PopupDialog width={280} height={this.state.alertHeight} dialogTitle={<DialogTitle titleAlign='left' title={this.state.alertTitle} />} ref={(popupDialog) => { this.popupDialog = popupDialog; }}><View><View style={{padding: 15}}><Text style={{fontSize: 16, color: 'black'}}>{this.state.alertText}</Text></View></View></PopupDialog>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },

    digitView: {
        height: 40,
        flexDirection: 'row',
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10
    },

    inputInnerView: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    registerText: {
        fontSize: 10,
        backgroundColor: 'transparent',
        color: '#111111'
    },

    digitText: {
        textAlign: 'right',
        fontSize: 36,
        color: 'black',
        fontWeight: 'bold'
    },

    keyboardRow: {
        height: Width / 4 * 0.8,
    },

    keyboard: {
        flex: 0.3333,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
    },

    digitKeyboard: {
        fontSize: 40,
        textAlign: 'center',
        color: 'black',
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0,
    },

    stringKeyboard: {
        fontSize: 14,
        textAlign: 'center',
        color: 'darkgray',
        backgroundColor: 'transparent',
        padding: 0,
        margin: 0
    },

    callButton: {
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        backgroundColor: 'black',
    },

    callText: {
        fontSize: 36,
        color: '#fafafa',
        backgroundColor: 'transparent'
    },

    callIcon: {
        position: 'absolute',
        left: 30,
        top:20,
        bottom: 20,
        backgroundColor: 'transparent'
    }

})

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    userInfo: state.userInfo,
    contacts: state.contacts
  }
}, mapDispatchToProps)(DialView);