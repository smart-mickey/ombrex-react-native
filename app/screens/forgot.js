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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import Button from 'apsl-react-native-button'
import Ionicons from 'react-native-vector-icons/Ionicons';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height


class Forgot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            email: '',
        }
    }

    showAlert(title, msg, height) {
        this.setState({alertTitle: title, alertText: msg, alertHeight: height})
        this.popupDialog.show()
    }

    render() {
        const _this = this
        return(
            
            <View style={styles.container}>
                <KeyboardAwareScrollView style={{flex: 1}}>
                    <TouchableOpacity onPress={() => Actions.pop()} style={styles.backView}>
                        <Ionicons name='ios-arrow-round-back' color='black' size={40} style={{backgroundColor: 'transparent'}}/>
                    </TouchableOpacity>
                    <View style={styles.logoView}>
                        <Image source={require('../resources/image/logo.png')} style={styles.logoImage}/>
                    </View>
                    <View style={styles.inputDetail}>
                        <Text style={styles.inputDetailText}>Please enter details to continue</Text>
                    </View>
                    <View style={styles.inputInnerView}>
                        <View style={styles.inputInnerView}>
                            <TextInput
                                placeholder='Email'
                                onChangeText={(text) => {this.setState({email: text})}}
                                placeholderTextColor='#999999'
                                underlineColorAndroid='transparent'
                                style={styles.textInputView}
                                textStyle={styles.inputText}
                                maxLength={50}
                            />
                            <TextInput
                                placeholder='Phone Number'
                                onChangeText={(text) => {this.setState({mobile: text})}}
                                placeholderTextColor='#999999'
                                underlineColorAndroid='transparent'
                                style={styles.textInputView}
                                textStyle={styles.inputText}
                                maxLength={12}
                                keyboardType='phone-pad'
                            />
                        </View>
                    </View>
                    <View style={styles.inputInnerView}>
                        <View style={styles.inputInnerView}>
                            <Button 
                                style = {styles.loginButton}
                                textStyle = {{color: '#fafafa'}}
                                isDisabled = {this.state.isLoading}
                                isLoading = {this.state.isLoading}
                                activityIndicatorColor = 'black'
                                onPress = {() => {
                                    this.setState({isLoading: true})
                                    this.props.submitResetPassword(this.state.email, this.state.mobile, (result) => {
                                        if(result == 'invalid'){
                                            _this.showAlert('Ombrex - input error', 'You have wrong email or phone number!', 140)
                                        }
                                        else if(result == 'success'){
                                            _this.showAlert('Ombrex - success', 'Password Reset Email Sent to ' + _this.state.email, 150)
                                            Actions.pop()
                                        }
                                        else {
                                            _this.showAlert('Ombrex - error', 'Network error.', 100)
                                        }
                                    })
                                }}>
                                <Text style={styles.loginText}>Submit</Text>
                            </Button>
                        </View>
                    </View>
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
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
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
        color: '#111111',
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
        borderColor: '#111111',
        textAlign: 'center'
    },

    inputText: {
        fontSize: 18,
        color: '#111111',        
    },

    loginButton: {
        backgroundColor: '#111111',
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
  }
}, mapDispatchToProps)(Forgot);