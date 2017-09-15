import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ListView,
  Switch,
  TextInput,
  Linking
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as types from '../redux/actions/types'
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height

class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            setting: {},
            forwarding: props.forwarding,
            number: props.number,
            disturb: props.disturb
        }
    }

    render() {
        const _this = this
        const titleConfig = {
            title: 'ABOUT',
            tintColor: 'white',
            style: {
                fontSize: 20,
            }
        };
        const leftButtonConfig = <TouchableOpacity style={{justifyContent: 'center', paddingLeft: 10}} onPress={() => Actions.pop()}><Ionicons name='ios-arrow-round-back' color='white' size={40} /></TouchableOpacity>
        return(
            <View style={{flex: 1}}>
                <NavigationBar
                    style = {{backgroundColor: '#222222', height:60}}
                    title = {titleConfig}
                    leftButton = {leftButtonConfig}
                />
                <View style={styles.container}>
                    <View style={styles.buttonView}>
                        <View style={styles.buttonInnerView}>
                            <View>
                                <TouchableOpacity 
                                    style = {styles.button}
                                    onPress = {() => Linking.openURL(types.URL_TERMS_AND_CONDITION)}>
                                    <Text style={styles.buttonText}>Terms and Conditions</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.buttonView}>
                        <View style={styles.buttonInnerView}>
                            <View>
                                <TouchableOpacity 
                                    style = {styles.button}
                                    onPress = {() => Linking.openURL(types.URL_PRIVACY_POLICY)}>
                                    <Text style={styles.buttonText}>Privacy Policy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.buttonView}>
                        <View style={styles.buttonInnerView}>
                            <View>
                                <TouchableOpacity 
                                    style = {styles.button}
                                    onPress = {() => Linking.openURL(types.URL_911)}>
                                    <Text style={styles.buttonText}>911 limitations</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonView: {
        marginTop: 20,
        height: 60,   
        width: Width
    },

    buttonInnerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        backgroundColor: '#111111',
        width: Width - 160,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },

    buttonText: {
        color: '#fafafa',
        fontSize: 20,
        textAlign: 'center'
    },
})

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    appState: state.app_state,
    userInfo: state.userInfo
  }
}, mapDispatchToProps)(About);