import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ListView,
  Alert,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import Button from 'apsl-react-native-button'
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNExitApp from 'react-native-exit-app';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const Items = [
    {
        title: 'Call Setting',
        icon: 'ios-settings'
    },
    {
        title: 'About',
        icon: 'md-log-out'
    },
]
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});


class MoreView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: ds.cloneWithRows(Items)
        }
    }

    renderItem(item, sectionId, rowId) {
        return(
            <TouchableOpacity style={styles.itemView} onPress={() => this.onClickItem(item.title)}>
                <Ionicons name={item.icon} color='#111111' size={25} />
                <Text style={styles.itemText}>{item.title}</Text>
            </TouchableOpacity>
        )        
    }

    onClickItem(title) {
        switch(title){
            case 'Call Setting':
                this.props.getSettingValues(this.props.userInfo, (result) => {
                    if(result == 'Unauthorized'){
                        _this.showAlert('Ombrex - violation', 'You are unauthorized or your token is expired.', 140)
                        _this.props.Logout()
                    }
                    else if(result == 'error'){
                        _this.showAlert('Ombrex - error', 'Network error.', 100)
                    }
                    else{
                        Actions.Setting({forwarding: (result.call_forwarding.mode == 'off'?false:true), number: result.call_forwarding.number, disturb: (result.do_not_disturb == 'on'?true:false)})
                    }
                })
                break
            case 'About':
                Actions.About()
                break
            case 'exit':
                Alert.alert(
                    '',
                    'Are you sure you want to exit?',
                    [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'Yes', onPress: () => RNExitApp.exitApp()},
                    ],
                    { cancelable: false }
                )
                
                break
            default:
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
        return(
            <View style={styles.container}>
                <NavigationBar
                    style = {{backgroundColor: '#222222', height:60}}
                    title = {titleConfig}
                />
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderItem.bind(this)}
                    style={{padding: 10}}
                />
                <View style={styles.logoutButtonView}>
                    <View>
                        <Button 
                            style = {styles.loginButton}
                            textStyle = {{color: '#fafafa'}}
                            isDisabled = {this.state.isLoading}
                            isLoading = {this.state.isLoading}
                            activityIndicatorColor = 'black'
                            onPress = {() => {
                                _this.props.Logout()
                            }}>
                            <Text style={styles.logoutText}>Log out</Text>
                        </Button>
                    </View>
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

    itemView: {
        height: 50,
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderColor: 'darkgray',
        alignItems: 'center'
    },

    itemText: {
        color: '#111111',
        backgroundColor: 'transparent',
        fontSize: 18,
        marginLeft: 15
    },

    loginButton: {
        backgroundColor: '#111111',
        width: Width - 160,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },

    logoutButtonView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    logoutText: {
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
    userInfo: state.userInfo,
  }
}, mapDispatchToProps)(MoreView);