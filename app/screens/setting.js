import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ListView,
  Switch,
  TextInput
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import Button from 'apsl-react-native-button'
import Ionicons from 'react-native-vector-icons/Ionicons';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const Items = [
    {
        title: 'setting',
        icon: 'ios-settings'
    },
    {
        title: 'logout',
        icon: 'md-log-out'
    }
]
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setting: {},
            forwarding: props.forwarding,
            number: props.number,
            disturb: props.disturb,
            isSaved: false
        }
    }
    
    showAlert(title, msg, height) {
        this.setState({alertTitle: title, alertText: msg, alertHeight: height})
        this.popupDialog.show()
    }

    render() {
        const _this = this
        const titleConfig = {
            title: 'SETTINGS',
            tintColor: 'white',
            style: {
                fontSize: 20,
            }
        };
        const leftButtonConfig = <TouchableOpacity style={{justifyContent: 'center', paddingLeft: 10}} onPress={() => Actions.pop()}><Ionicons name='ios-arrow-round-back' color='white' size={40} /></TouchableOpacity>
        return(
            <View style={styles.container}>
                <NavigationBar
                    style = {{backgroundColor: '#222222', height:60}}
                    title = {titleConfig}
                    leftButton = {leftButtonConfig}
                />
                <View style={styles.section}>
                    <View style={styles.sectionView}>
                        <View>
                            <Text style={styles.label}>Don't disturb</Text>
                        </View>
                        <View>
                            <Text style={styles.switchText}>{this.state.disturb ? "On":'Off'}</Text>
                            <Switch
                                onValueChange={(value) => this.setState({disturb: value})}
                                value={this.state.disturb}
                                style={styles.switch}
                                onTintColor='darkgray'
                                tintColor='darkgray'
                                thumbTintColor={this.state.disturb ? "#222":'darkgray'}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionView}>
                        <View>
                            <Text style={styles.label}>Call Forwardings</Text>
                        </View>
                        <View>
                            <Text style={styles.switchText}>{this.state.forwarding ? "On":'Off'}</Text>
                            <Switch
                                onValueChange={(value) => this.setState({forwarding: value})}
                                value={this.state.forwarding}
                                style={styles.switch}
                                onTintColor='darkgray'
                                tintColor="darkgray"
                                thumbTintColor={this.state.forwarding ? "#222":'darkgray'}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionView}>
                        <View>
                            <Text style={styles.label}>Number</Text>
                        </View>
                        <View>
                            <TextInput
                                placeholder='none'
                                onChangeText={(text) => {this.setState({number: text})}}
                                placeholderTextColor='#999999'
                                underlineColorAndroid='transparent'
                                style={styles.textInputView}
                                textStyle={styles.inputText}
                                maxLength={50}
                                keyboardType='phone-pad'
                                value = {this.state.number}
                            />
                        </View>
                    </View>
                </View>
                
                <View style={styles.buttonView}>
                    <View style={styles.buttonInnerView}>
                        <View>
                            <Button 
                                style = {styles.loginButton}
                                textStyle = {{color: '#fafafa'}}
                                isDisabled = {this.state.isLoading}
                                isLoading = {this.state.isLoading}
                                activityIndicatorColor = 'white'
                                onPress = {() => {
                                    _this.setState({isLoading: true})
                                    _this.props.updateSettingValues(_this.props.userInfo, _this.state.forwarding, _this.state.number, _this.state.disturb, (result) => {
                                        _this.setState({isLoading: false})
                                        if(result == 'success') {
                                            _this.setState({isSaved: true})
                                            _this.showAlert('Ombrex - success', 'the settings were saved', 100)
                                        }
                                        else if(result == 'Unauthorized'){
                                            _this.showAlert('Ombrex - violation', 'You are unauthorized or your token is expired.', 140)
                                            _this.props.Logout()
                                        }
                                        else _this.showAlert('Ombrex - error', 'Network error.', 100)
                                    })         
                                }}>
                                <Text style={styles.loginText}>SAVE</Text>
                            </Button>
                        </View>
                    </View>
                </View>
                <PopupDialog width={280} height={this.state.alertHeight} onDismissed={() => {if(_this.state.isSaved)Actions.pop()}} dialogTitle={<DialogTitle titleAlign='left' title={this.state.alertTitle} />} ref={(popupDialog) => { this.popupDialog = popupDialog; }}><View><View style={{padding: 15}}><Text style={{fontSize: 16, color: 'black'}}>{this.state.alertText}</Text></View></View></PopupDialog>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },

    label: {
        fontSize: 18,
        backgroundColor: 'transparent',
        color: '#111111',
        paddingLeft: 20
    },

    section: {
        height: 60,
        borderBottomWidth: 0.5,
        borderColor: 'darkgray',
        marginLeft: 10,        
    },

    sectionView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    textInputView: {
        backgroundColor: 'transparent',
        width: 150,
        height: 40,
        marginRight: 25,
        textAlign: 'right'
    },

    inputText: {
        fontSize: 18,
        color: '#111111',        
    },

    switch: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 25,
        height: 35
    },

    buttonView: {
        marginTop: 50,
        height: 60,   
        width: Width
    },

    buttonInnerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

    switchText: {
        color: '#222'
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
}, mapDispatchToProps)(Setting);