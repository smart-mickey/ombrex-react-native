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
  ListView
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import NavigationBar from 'react-native-navbar';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import Button from 'apsl-react-native-button'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import * as libraries from '../lib/library'
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
var Contacts = require('react-native-contacts')
const category = [
    {
        title: 'All',
        direction: ''
    },
    {
        title: 'Outgoing',
        direction: 'outgoing'
    },
    {
        title: 'Incoming',
        direction: 'inbound'
    },
    {
        title: 'Missed',
        direction: 'missed'
    },
]
class HistoryView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.getCallHistories()
    }

    getCallHistories() {
        const _this = this
        this.setState({Progress: true})
        this.props.getCallHistories(this.props.userInfo, (res) => {
            _this.setState({Progress: false})
            if(res == 'success'){

            }
            else if(res == 'Unauthorized'){
                _this.showAlert('Ombrex - violation', 'You are unauthorized or your token is expired.', 140)
                _this.props.Logout()
            }
            else{
                _this.showAlert('Ombrex - error', 'Network error.', 100)
            } 
        })
    }

    convertToCallTime(T) {
        let H = Math.floor(T / 3600)
        let M = Math.floor(T / 60)
        let S = T % 60
        return (H > 0 ? (H + ':') : '') + (M < 10 ? '0' : Math.floor(M / 10)) + (M % 10) + ':' + (S < 10 ? '0' : Math.floor(S / 10)) + (S % 10)
    }

    timeDifference(current, previous) {

        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed/1000) + ' seconds ago';   
        }

        else if (elapsed < msPerHour) {
            return Math.round(elapsed/msPerMinute) + ' minutes ago';   
        }

        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + ' hours ago';   
        }

        else if (elapsed < msPerMonth) {
            return Math.round(elapsed/msPerDay) + ' days ago';   
        }

        else if (elapsed < msPerYear) {
            return Math.round(elapsed/msPerMonth) + ' months ago';   
        }

        else {
            return Math.round(elapsed/msPerYear ) + ' years ago';   
        }
    }

    renderNumberSection(item){
        switch(item.direction){
            case 'outgoing':
                return(
                    <View style={styles.numberSection}>
                        <Ionicons name='md-arrow-round-forward' color='purple' size={20} />
                        <Ionicons name='md-call' color='purple' size={20} />
                        <Text style={styles.numberText}>{item.to}</Text>
                    </View>
                )
            case 'inbound':
                return(
                    <View style={styles.numberSection}>
                        <Ionicons name='md-call' color='blue' size={20} />
                        <Ionicons name='md-arrow-round-back' color='blue' size={20} />                        
                        <Text style={styles.numberText}>{item.from}</Text>
                    </View>
                )
            case 'missed':
                return(
                    <View style={styles.numberSection}>
                        <Ionicons name='md-close' color='red' size={10} style={{marginTop: 10}}/>
                        <Ionicons name='md-call' color='red' size={20} />
                        <Text style={styles.numberText}>{item.from}</Text>
                    </View>
                )
            default:
        }    
    }

    onClickHistory(item) {
        const _this = this
        let phoneNumber = item.to
        if(item.direction == 'inbound' || item.direction == 'missed') phoneNumber = item.from
        this.props.onCall(phoneNumber, this.props.userInfo, (result) => {
            if(result == 'Some server error'){
                _this.showAlert('Ombrex - error', result, 100)
            }
            else if(result == 'Unauthorized'){
                _this.showAlert('Ombrex - violation', 'You are unauthorized or your token is expired.', 140)
                _this.props.Logout()
            }
            else if(result == undefined || result == 'error'){
                RNImmediatePhoneCall.immediatePhoneCall(libraries.toClearPhoneNumber(_this.props.userInfo.access_number + ',' + phoneNumber));
            }
            else{
                _this.props.saveProxyNumber(result)
                RNImmediatePhoneCall.immediatePhoneCall(libraries.toClearPhoneNumber(result));
            }
        })
    }

    showAlert(title, msg, height) {
        this.setState({alertTitle: title, alertText: msg, alertHeight: height})
        this.popupDialog.show()
    }

    render() {
        const _this = this
        let currentTime = new Date().getTime()
        const titleConfig = {
            title: 'RECENTS',
            tintColor: 'white',
            style: {
                fontSize: 20,
            }
        };
        const rightButtonConfig = <TouchableOpacity style={{justifyContent: 'center', padding: 15}} onPress={() => _this.getCallHistories()}><Ionicons name='md-refresh' color='white' size={20} /></TouchableOpacity>
        return(
            <View style={styles.container}>
                <NavigationBar
                    style = {{backgroundColor: '#222222', height:60}}
                    title = {titleConfig}
                    rightButton = {rightButtonConfig}
                />
                <Spinner visible = {this.state.Progress} textContent="" color='black' />
                <ScrollableTabView 
                        renderTabBar={() => <DefaultTabBar style={{borderBottomWidth: 1, borderColor: 'darkgray', height: 60, paddingTop: 10}}/>}
                        initialPage={0}
                        tabBarUnderlineStyle={{backgroundColor: '#222222'}}
                        tabBarTextStyle={{fontSize: 16}}
                        tabBarActiveTextColor='black'
                        tabBarInactiveTextColor='darkgray'
                        tabBarPosition='top'>
                        {
                            category.map(function(cty, index){
                                if(JSON.stringify(_this.props.callHistory).indexOf(cty.direction) < 0 || _this.props.callHistory.length == 0){
                                    return(
                                        <View key={index} tabLabel={cty.title} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: 'darkgray'}}>No data</Text>
                                        </View>
                                    )
                                }
                                else{
                                    return(
                                        <View key={index} tabLabel={cty.title} style={{flex: 1}}>
                                            <ScrollView style={{flex: 1, padding: 10}}>
                                                {   
                                                    _this.props.callHistory.map(function(item, index){
                                                        if(cty.direction == '' || item.direction == cty.direction){
                                                            return(
                                                                <TouchableOpacity key={index} style={styles.historyItemView} onPress={() => {_this.onClickHistory(item)}}>
                                                                        {
                                                                            _this.renderNumberSection(item)
                                                                        }      
                                                                        <View style={styles.timeSection}>
                                                                            <View style={styles.timeItem}><Text style={styles.timeText}>{_this.convertToCallTime(item.duration)}</Text></View>
                                                                            <View style={styles.timeItem}><Text style={styles.timeText}>{_this.timeDifference(currentTime, item.timestamp * 1000)}</Text></View>
                                                                        </View>
                                                                </TouchableOpacity>
                                                            )
                                                        }
                                                    })
                                                }
                                            </ScrollView>
                                        </View>
                                    )
                                }
                            })
                        }
                </ScrollableTabView>
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

    historyItemView: {
        height: 60,
        borderBottomWidth: 0.5,
        borderColor: 'darkgray',
        padding: 5,
        flex: 1,
        flexDirection: 'row'
    },

    timeItem: {
        flex: 1,
        justifyContent: 'center',
    },

    numberSection: {
        flex: 0.7,
        flexDirection: 'row',
        alignItems: 'center',
    },

    timeSection: {
        flex: 0.3,
        justifyContent: 'space-between',
    },

    timeText: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 10,
        textAlign: 'right',
        color: '#222',
        fontSize: 12
    },

    numberText: {
        fontSize: 20,
        color: 'black',
        paddingLeft: 15
    },
})

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    userInfo: state.userInfo,
    callHistory: state.callHistory,
    contacts: state.contacts
  }
}, mapDispatchToProps)(HistoryView);