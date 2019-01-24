import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import AppNavigator from './navigation/AppNavigator';

import Modal from "react-native-modal";
import { withNativeAd } from 'expo/build/facebook-ads';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state ={ 
      isModalVisible: false,
      dataSource: null,
      hasCameraPermission: null,
    }
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    };

  _toggleModal = () =>
  this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    const { hasCameraPermission } = this.state;
    

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex: 1, justifyContent:"center" }}>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modalWind}>
            <FlatList
            data={this.state.dataSource}
            renderItem={({item}) => 
            <Text>
            Navn: {item.name},
            Pris: {item.pris},
            EAN-kode:{item.serial}
            </Text>}
            keyExtractor={({id}, index) => id}
            />
          </View>
          <View>
            <TouchableOpacity onPress={this._toggleModal}>
              <Text>Hide me!</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <BarCodeScanner style={StyleSheet.absoluteFill}
          onBarCodeScanned={this.handleBarCodeScanned}
        />
      </View>
    );
  };
   
  handleBarCodeScanned = ({ type, data }) => {
    return fetch('http://192.168.1.45:3000/products/' + data)
      .then((response) => response.json())
      .then((responseJson) => {
          this.setState({
            dataSource: responseJson.response,
            isModalVisible: true
          })
      })
      .catch((error) =>{
        console.error(error);
      });
  }
}

const styles = StyleSheet.create({
  modalWind: {
    backgroundColor: "white",
    borderRadius: 25,
  },

  
  
});

