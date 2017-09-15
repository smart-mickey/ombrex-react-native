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
  Dimensions
} from 'react-native';
import Storage from 'react-native-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import Button from 'apsl-react-native-button'
import {Actions} from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    sync : {
    }
})	

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            email: '',
            pass: '',
            notifyText: 'Please enter details to continue',
            isRequiredOTP: false,
            OTP: ''
        }
    }

    componentDidMount() {
        this.props.getUserContacts(()=>{})
        storage.load({
            key: 'myaccount',
        }).then(ret => {
            this.props.setUserInfo({
                access_number: ret.access_number,
                access_token: ret.access_token
            })    
            Actions.Home()   
        }).catch(err => {
            //alert(JSON.stringify(err))
        });
        
    }

    login() {
        const _this = this
        this.setState({isLoading: true})
        this.props.login(this.state.email, this.state.pass, this.state.mobile, (result) => {
            this.setState({isLoading: false})
            if(result == 'success'){
                this.storeAccountToLocalStorage()
                this.setState({pass: ''})      
            }
            else if(result == 'invalid'){
                _this.showAlert('Ombrex - input error', 'You have wrong email or phone number!', 140)
            }
            else if(result == 'OTP'){
                this.setState({notifyText: 'Please enter OTP token to pass', isRequiredOTP: true})
            }
            else{
                _this.showAlert('Ombrex - error', result, 100)
            }
        })
    }

    onConfirmOTP() {
        this.setState({isLoading: true})
        this.props.confirmOTP(this.state.email, this.state.pass, this.state.mobile, this.state.OTP, (result) => {
            this.setState({isLoading: false})
            if(result == 'success') {
                this.storeAccountToLocalStorage()
                this.setState({pass: '', isRequiredOTP: false})                   
            }
            else if(result == 'invalid'){
                _this.showAlert('Ombrex - error', 'Invalid OTP', 100)
            }
            else{
                _this.showAlert('Ombrex - error', result, 100)
            }
        })
    }

    storeAccountToLocalStorage() {
        storage.clearMap();
        storage.save({
            key: 'myaccount',   // Note: Do not use underscore("_") in key! 
            data: {
                access_token: this.props.userInfo.access_token,
                access_number: this.props.userInfo.access_number
            },
            expires: null
        }); 
    }

    showAlert(title, msg, height) {
        this.setState({alertTitle: title, alertText: msg, alertHeight: height})
        this.popupDialog.show()
    }

    render() {
        const _this = this
        return(
            
            <View style={styles.container}>      
                <KeyboardAwareScrollView style={{flex: 1, height: Height, position: 'relative'}}>  
                    {
                        this.state.isRequiredOTP?
                        <TouchableOpacity onPress={() => this.setState({isRequiredOTP: false})} style={styles.backView}>
                            <Ionicons name='ios-arrow-round-back' color='black' size={40} style={{backgroundColor: 'transparent'}}/>
                        </TouchableOpacity>
                        :
                        null
                    }        
                    <View style={styles.logoView}>
                        <Image source={require('../resources/image/logo.png')} style={styles.logoImage}/>
                    </View>
                    <View style={styles.inputDetail}>
                        <Text style={styles.inputDetailText}>{this.state.notifyText}</Text>
                    </View>
                    {
                        this.state.isRequiredOTP?
                        <View style={styles.inputInnerView}>
                            <View style={styles.inputInnerView}>
                                <TextInput
                                    placeholder='OPT token'
                                    onChangeText={(text) => {this.setState({OTP: text})}}
                                    placeholderTextColor='darkgray'
                                    underlineColorAndroid='transparent'
                                    style={styles.textInputView}
                                    textStyle={styles.inputText}
                                    maxLength={50}
                                    keyboardType='numeric'
                                    value = {this.state.OTP}
                                />
                            </View>
                        </View>
                        :
                        <View style={styles.inputInnerView}>
                            <View style={styles.inputInnerView}>
                                <TextInput
                                    placeholder='Email/Phone Number'
                                    onChangeText={(text) => {this.setState({email: text})}}
                                    placeholderTextColor='darkgray'
                                    underlineColorAndroid='transparent'
                                    style={styles.textInputView}
                                    textStyle={styles.inputText}
                                    maxLength={50}
                                    value = {this.state.email}
                                />
                                <TextInput
                                    placeholder='Password'
                                    onChangeText={(text) => {this.setState({pass: text})}}
                                    placeholderTextColor='darkgray'
                                    underlineColorAndroid='transparent'
                                    style={styles.textInputView}
                                    textStyle={styles.inputText}
                                    maxLength={20}
                                    value = {this.state.pass}
                                    secureTextEntry = {true}
                                />
                                <TextInput
                                    placeholder='Mobile Number'
                                    onChangeText={(text) => {this.setState({mobile: text})}}
                                    placeholderTextColor='darkgray'
                                    underlineColorAndroid='transparent'
                                    style={styles.textInputView}
                                    textStyle={styles.inputText}
                                    keyboardType='phone-pad'
                                    maxLength={12}
                                    value = {this.state.mobile}
                                />
                            </View>
                        </View>
                    }
                    
                    <View style={styles.inputInnerView}>
                        <View style={styles.inputInnerView}>
                            <Button 
                                style = {styles.loginButton}
                                textStyle = {{color: '#fafafa'}}
                                isDisabled = {this.state.isLoading}
                                isLoading = {this.state.isLoading}
                                activityIndicatorColor = '#fafafa'
                                onPress = {() => {
                                    if(this.state.isRequiredOTP){
                                        this.onConfirmOTP()
                                    }else{
                                        this.login()
                                    }
                                }}>
                                <Text style={styles.loginText}>{this.state.isRequiredOTP?'Confirm':'Login'}</Text>
                            </Button>
                        </View>
                    </View>
                    {
                        this.state.isRequiredOTP?
                        null
                        :
                        <TouchableOpacity style={styles.inputInnerView} onPress={() => {Actions.Forgot()}}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    }                    
                    <PopupDialog width={280} height={this.state.alertHeight} dialogTitle={<DialogTitle titleAlign='left' title={this.state.alertTitle} />} ref={(popupDialog) => { this.popupDialog = popupDialog; }}><View><View style={{padding: 15}}><Text style={{fontSize: 16, color: 'black'}}>{this.state.alertText}</Text></View></View></PopupDialog>
                </KeyboardAwareScrollView>                
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },

    logoView: {        
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },

    logoImage: {
        width: Width - 160,
        height: 60,
        resizeMode: 'contain',
    },

    inputDetail: {
        padding: 15
    },

    inputDetailText: {
        fontSize: 18,
        color: '#222',
        textAlign: 'center',

    },

    inputInnerView: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    textInputView: {
        marginBottom: 15,
        height: 50,
        width: Width - 80,
        borderRadius: 25,
        borderWidth: 0.5,
        borderColor: '#222',
        textAlign: 'center'
    },

    inputText: {
        fontSize: 18,
        color: '#222',        
    },

    loginButton: {
        backgroundColor: '#222',
        width: Width - 160,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },

    loginText: {
        color: '#fafafa',
        fontSize: 20,
        textAlign: 'center'
    },

    forgotText: {
        textAlign: 'center',
        color: '#222',
        fontSize: 14
    },

    copyRightText: {
        textAlign: 'center',
        color: '#222',
        fontSize: 12,       
    },

    backView: {
        padding: 20
    }
})

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    appState: state.app_state,
    userInfo: state.userInfo
  }
}, mapDispatchToProps)(Login);