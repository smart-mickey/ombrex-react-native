import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const FacebookTabBar = React.createClass({

  propTypes: {
    showModal: React.PropTypes.bool,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    modalDidClose: React.PropTypes.func
  },

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  },

  render() {
    return (
        <Modal
            overlayBackground={'rgba(0, 0, 0, 0.75)'}
            animationDuration={150}
            closeOnTouchOutside={true}
            open={this.props.showModal}
            modalDidClose={() => this.props.modalDidClose}
            modalStyle={{borderRadius: 15, padding: 20}}
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
    )
  },
});

const styles = StyleSheet.create({
  
});

export default FacebookTabBar;
