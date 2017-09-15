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
  ListView,
  Alert,
  DeviceEventEmitter
} from 'react-native';
import RNAudioStreamer from 'react-native-audio-streamer'
import NavigationBar from 'react-native-navbar';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import Button from 'apsl-react-native-button'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import Spinner from 'react-native-loading-spinner-overlay';
import * as types from '../redux/actions/types'
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const category = [
    {
        title: 'New',
        status: 'new'
    },
    {
        title: 'Saved',
        status: 'saved'
    },
    {
        title: 'Deleted',
        status: 'deleted'
    },
]
class VoiceMailView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1,
            VoicemailPlayer: null
        }
    }

    componentDidMount() {
        const _this = this
        this.getVoiceMails()
        DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged',this._statusChanged.bind(this))
    }

    _statusChanged(status) {
        // Your logic
        const _this = this
        switch(status){
            case 'BUFFERING':
                this.showAlert('Ombrex - Voicemail', 'Replay is preparing...', 100)
                break
            case 'FINISHED':
                this.showAlert('Ombrex - Voicemail', 'Replay is finished', 100)
                clearInterval(this.player)
                break
            default:
        }
        
    }

    getVoiceMails() {
        const _this = this
        this.setState({Progress: true})
        this.props.getVoiceMails(this.props.userInfo, (res) => {
            _this.setState({Progress: false})
            if(res == 'Unauthorized'){
                _this.showAlert('Ombrex - violation', 'You are unauthorized or your token is expired.', 140)
                _this.props.Logout()
            }
            else if(res == 'error'){
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
        switch(item.message_status){
            case 'new':
                return(
                    <View style={styles.numberSection}>
                        <Ionicons name='ios-mail-outline' color='red' size={20} />
                        <Text style={styles.numberText}>{item.from}</Text>
                    </View>
                )
            case 'saved':
                return(
                    <View style={styles.numberSection}>
                        <Ionicons name='ios-mail-outline' color='blue' size={20} />
                        <Text style={styles.numberText}>{item.from}</Text>
                    </View>
                )
            case 'deleted':
                return(
                    <View style={styles.numberSection}>
                        <Ionicons name='ios-mail-outline' color='darkgray' size={20}/>
                        <Text style={styles.numberText}>{item.from}</Text>
                    </View>
                )
            default:
        }    
    }

    onClickMail(item, index){
        const _this = this
        this.setState({selectedIndex: index})
        Alert.alert(
            'Actions',
            'Are you going to play or delete?',
            [
                {text: 'Play', onPress: () => {
                    RNAudioStreamer.setUrl(types.URL_PLAY_VOICE + item.id + '?accpet=audio%2Fmp3&authorization=Bearer%20' + this.props.userInfo.access_token)
                    RNAudioStreamer.play();
                    this.player = setInterval(function(){
                        RNAudioStreamer.currentTime((err, currentTime)=>{
                            if(!err) _this.showAlert('Ombrex - Voicemail - ' + _this.convertToCallTime(Math.floor(currentTime)), 'Replay is playing', 100)
                        })    
                    }, 1000);
                }},
                {text: 'Delete', onPress: () => {
                    this.props.deleteVoiceMail(item.id, this.props.userInfo, (res) => {
                        if(res == 'Unauthorized'){
                            _this.showAlert('Ombrex - violation', 'You are unauthorized or your token is expired.', 140)
                            _this.props.Logout()
                        }
                        else if(res == 'success'){
                            _this.showAlert('Ombrex - success', 'deleted successfully', 100)
                            _this.getVoiceMails()
                        }
                        else _this.showAlert('Ombrex - error', 'Network error.', 100)
                    })
                }},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                
            ],
            { cancelable: false }
        )
    }

    showAlert(title, msg, height) {
        this.setState({alertTitle: title, alertText: msg, alertHeight: height})
        this.popupDialog.show()
    }

    render() {
        const _this = this
        let currentTime = new Date().getTime()
        const titleConfig = {
            title: 'VOICE MAILS',
            tintColor: 'white',
            style: {
                fontSize: 20,
            }
        };
        const rightButtonConfig = <TouchableOpacity style={{justifyContent: 'center', padding: 15}} onPress={() => _this.getVoiceMails()}><Ionicons name='md-refresh' color='white' size={20} /></TouchableOpacity>
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
                        tabBarTextStyle={{fontSize: 20}}
                        tabBarActiveTextColor='#111111'
                        tabBarInactiveTextColor='#555555'
                        tabBarPosition='top'>
                        {
                            category.map(function(cty, index){
                                if(JSON.stringify(_this.props.Msg).indexOf('"' + cty.status + '"') < 0 || _this.props.Msg.length == 0){
                                    return(
                                        <View key={index} tabLabel={cty.title} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: 'darkgray'}}>No data</Text>
                                        </View>
                                    )
                                }
                                else{
                                    return(
                                        <View key={index} tabLabel={cty.title} style={{flex: 1}}>
                                            <ScrollView style={{flex: 1}}>
                                                {   
                                                    _this.props.Msg.map(function(item, index){
                                                        if(item.message_status == cty.status){
                                                            return(
                                                                <TouchableOpacity onPress={_this.onClickMail.bind(_this, item, index)} key={index} 
                                                                    style={[styles.historyItemView, {backgroundColor: _this.state.selectedIndex == index?'darkgray':'transparent'}]}>
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
        borderColor: 'lightgray',
        padding: 10,
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
        fontSize: 16,
        color: '#111111',
        paddingLeft: 15
    }
})

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    userInfo: state.userInfo,
    callHistory: state.callHistory,
    Msg: state.Msg
  }
}, mapDispatchToProps)(VoiceMailView);