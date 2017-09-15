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
} from 'react-native';
import {PullView} from 'react-native-pull';
import {Actions} from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../redux/actions'
import Button from 'apsl-react-native-button'
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import Modal from 'react-native-simple-modal';
import NavigationBar from 'react-native-navbar';
import Spinner from 'react-native-loading-spinner-overlay';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import * as libraries from '../lib/library' 
const Width = Dimensions.get('window').width
const Height = Dimensions.get('window').height
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var Contacts = require('react-native-contacts')

class ContactView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pNumberInfo: ds,
            selectedName: '',
            searchText: '',
            selectedImage: ''
        }
    }

    renderContact(item, sectionId, rowId) {
        const _this = this
        return(
            <TouchableOpacity key={rowId} style={styles.contactItem} onPress={() => {
                _this.setState({pNumberInfo: ds.cloneWithRows(item.phoneNumbers), showModal: true, selectedName: item.givenName + ' ' + item.familyName})
            }}>
                <Text style={styles.contactName}>{item.givenName + ' ' + item.familyName}</Text>
            </TouchableOpacity>
        )
    }

    renderPhoneNumberRow(item, sectionId, rowId) {
        const _this = this
        return(
            <TouchableOpacity key={rowId} style={styles.phoneNumberItem} onPress={() => {
                _this.props.onCall(item.number, _this.props.userInfo, (result) => {
                    if(result == 'Some server error'){
                        _this.showAlert('Ombrex - error', result, 100)
                    }
                    else if(result == 'Unauthorized'){
                        _this.showAlert('Ombrex - violation', 'You are unauthorized or your token is expired.', 140)
                        _this.props.Logout()
                    }
                    else if(result == undefined || result == 'error'){
                        RNImmediatePhoneCall.immediatePhoneCall(libraries.toClearPhoneNumber(_this.props.userInfo.access_number + ',' + item.number));
                    }
                    else{
                        _this.props.saveProxyNumber(result)
                        RNImmediatePhoneCall.immediatePhoneCall(libraries.toClearPhoneNumber(result));
                    }
                })
            }}>
                <Text style={[styles.contactName, {color: '#fafafa'}]}>{item.label + ': ' + item.number}</Text>
            </TouchableOpacity>
        )
    }

    showSmallPhotoImage(url) {
        if(url == ''){
            return(
                <Image source={require('../resources/image/person.png')} style={{width: 36, height: 36, borderRadius: 18, resizeMode: 'stretch'}}/>
            )
        }
        else{
            return(
                <Image source={{uri: url}} style={{width: 36, height: 36, borderRadius: 18, resizeMode: 'stretch'}}/>
            )
        }
    }

    showBigPhotoImage(url) {
        if(url == ''){
            return(
                <Image source={require('../resources/image/person.png')} style={{width: 72, height: 72, borderRadius: 36, resizeMode: 'stretch'}}/>
            )
        }
        else{
            return(
                <Image source={{uri: url}} style={{width: 72, height: 72, borderRadius: 36, resizeMode: 'stretch'}}/>
            )
        }
    }

    showAlert(title, msg, height) {
        this.setState({alertTitle: title, alertText: msg, alertHeight: height})
        this.popupDialog.show()
    }

    render() {
        const _this = this
        const titleConfig = {
            title: 'CONTACTS',
            tintColor: 'white',
            style: {
                fontSize: 20,
            }
        };
        const rightButtonConfig = <TouchableOpacity style={{justifyContent: 'center', padding: 15}} onPress={() =>{
            _this.setState({Progress: true})
            _this.props.getUserContacts(() => {
                _this.setState({Progress: false})
            })
        }}><Ionicons name='md-refresh' color='white' size={20} /></TouchableOpacity>
        return(
            <View style={styles.container}>
                <NavigationBar
                    style = {{backgroundColor: '#222222', height:60}}
                    title = {titleConfig}
                    rightButton = {rightButtonConfig}
                />
                <Spinner visible = {this.state.Progress} textContent="" color='black' />
                <View style={styles.searchView}>
                    <TextInput
                        placeholder='search contact'
                        onChangeText={(text) => {this.setState({searchText: text})}}
                        placeholderTextColor='#999999'
                        underlineColorAndroid='transparent'
                        style={styles.searchBar}
                        textStyle={styles.inputText}
                    />
                    <View style={styles.searchIcon}>
                        <Ionicons name='ios-search' color='darkgray' size={20} />
                    </View>
                </View>
                <ScrollView style={{flex: 1, padding: 10}}>
                    {
                        this.props.contactDatas.map(function(item, index){
                            let fullName = item.givenName + ' ' + (item.familyName ? item.familyName : '')
                            if(_this.state.searchText.length > 0 && fullName.toLowerCase().indexOf(_this.state.searchText.toLowerCase()) < 0) return
                            else if(item.phoneNumbers.length == 0) return
                            return(
                                <TouchableOpacity key={index} style={styles.contactItem} onPress={() => {
                                    _this.setState({pNumberInfo: ds.cloneWithRows(item.phoneNumbers), showModal: true, selectedName: fullName, selectedImage: item.thumbnailPath})
                                }}>
                                    <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                                        {_this.showSmallPhotoImage(item.thumbnailPath)}
                                    </View>
                                    <View style={{flex: 0.8, justifyContent: 'center'}}>
                                        <Text style={styles.contactName}>{fullName}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
                <Modal
                    overlayBackground={'rgba(0, 0, 0, 0.75)'}
                    animationDuration={250}
                    closeOnTouchOutside={true}
                    open={this.state.showModal}
                    modalDidClose={() => {this.setState({showModal: false})}}
                    modalStyle={{borderWidth: 1, borderColor: 'black', padding: 20}}
                >
                    <View style={styles.contactListView}>
                        <View style={styles.popupImageView}>
                            {this.showBigPhotoImage(this.state.selectedImage)}                            
                        </View>
                        <View>
                            <Text style={styles.personNameText}>{this.state.selectedName}</Text>
                        </View>
                        <ListView
                            dataSource={this.state.pNumberInfo}
                            renderRow={this.renderPhoneNumberRow.bind(this)}
                        />
                    </View>
                </Modal>
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

    searchView: {
        backgroundColor: 'darkgray',
        borderTopWidth: 1,
        borderColor: '#fafafa',
        padding: 10,
        height: 50,
        width: Width,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },

    searchIcon: {
        position: 'absolute',
        left: 40,
        top: 15,
        bottom: 15,
        backgroundColor: 'transparent' 
    },

    refreshIcon: {
        position: 'absolute',
        right: 40,
        top: 15,
        bottom: 15,
        backgroundColor: 'transparent' 
    },

    searchBar: {        
        height: 30,
        flex: 1,
        width: Width - 20,
        backgroundColor: '#fafafa',
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding: 0,
    },

    inputText: {
        fontSize: 18,
        color: '#111111',        
    },

    contactItem: {
        borderBottomWidth: 1,
        borderColor: 'darkgray',
        height: 60,
        flex: 1,
        flexDirection: 'row'
    },

    phoneNumberItem: {
        height: 40,
        backgroundColor: '#111111',
        borderRadius: 8,
        flex: 1,
        justifyContent: 'center',
        marginBottom: 10
    },

    contactName: {
        fontSize: 18,
        color: 'black',
        backgroundColor: 'transparent',
        padding: 10
    },

    contactNumber: {
        fontSize: 16,
        backgroundColor: 'transparent'
    },

    personNameText: {
        color: 'darkgray',
        fontSize: 24,
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingBottom: 20
    },

    popupImageView: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}
export default connect((state) => {
  return {
    userInfo: state.userInfo,
    contactDatas: state.contacts,
    loadingContact: state.loadingContact
  }
}, mapDispatchToProps)(ContactView);