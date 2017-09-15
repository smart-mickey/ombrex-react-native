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
import FacebookTabBar from '../component/FacebookTabBar'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import Button from 'apsl-react-native-button'
import Ionicons from 'react-native-vector-icons/Ionicons';
import DialView from './dialView'
import ContactView from './contactView'
import HistoryView from './historyView'
import MoreView from './moreView'
import VoiceMailView from './voiceMailView'
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
var Contacts = require('react-native-contacts')

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: '',
            email: '',
        }
    }

    componentDidMount() {
        this.props.getVoiceMailInTimer(this.props.userInfo, (res)=>{
            if(res == 'Unauthorized'){
                _this.showAlert('Ombrex - violation', 'You are unauthorized or your token is expired.', 140)
                _this.props.Logout()
            }
            else if(res == 'error'){
                _this.showAlert('Ombrex - error', 'Network error.', 100)
            }
        })
    }

    showAlert(title, msg, height) {
        this.setState({alertTitle: title, alertText: msg, alertHeight: height})
        this.popupDialog.show()
    }

    render() {
        const _this = this
        return(
            
            <View style={styles.container}>
                <ScrollableTabView 
                        renderTabBar={() => <FacebookTabBar style={{borderTopWidth: 1, borderColor: 'darkgray', height: 70}}/>}
                        initialPage={0}
                        onChangeTab={(tab)=>{this.onClickTab(tab)}}
                        tabBarPosition='bottom'>
                    <DialView tabLabel='md-keypad' />
                    <ContactView tabLabel='ios-contact' />
                    <HistoryView tabLabel='ios-timer' />                    
                    <VoiceMailView tabLabel='ios-recording' />
                    <MoreView tabLabel='md-settings' />
                </ScrollableTabView>
                {
                    this.props.badge > 0?
                    <View style={styles.badge}>
                        <Text style={[styles.badgeNumber, {width: this.props.badge < 10 ? 20: null}]}>{this.props.badge}</Text>
                    </View>
                    :
                    null
                }
                <PopupDialog width={280} height={this.state.alertHeight} dialogTitle={<DialogTitle titleAlign='left' title={this.state.alertTitle} />} ref={(popupDialog) => { this.popupDialog = popupDialog; }}><View><View style={{padding: 15}}><Text style={{fontSize: 16, color: 'black'}}>{this.state.alertText}</Text></View></View></PopupDialog>
            </View>
            
        )
    }

    onClickTab(tab) {
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa'
    },
    badge: {
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 25,
        position: 'absolute',
        bottom: 40,
        right: 12 + Width / 5,
        padding: 3
    },

    badgeNumber: {
        color: '#fafafa',
        textAlign: 'center'
    }
    
})

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    userInfo: state.userInfo,
    badge: state.badge
  }
}, mapDispatchToProps)(Home);