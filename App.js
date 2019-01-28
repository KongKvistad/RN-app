import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text, TextInput, Button } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import AppNavigator from './navigation/AppNavigator';

import Modal from "react-native-modal";

import Modaltest from "./modal";

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state ={ 
      isModalVisible: false,
      dataSource: null,
      hasCameraPermission: null,
      productPrice: null,
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
      <View style={{ flex: 1, justifyContent: 'center',}}>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modalWind}>
            <Text style= {styles.X} onPress={this._toggleModal}>X</Text>
            <Text style= {styles.heading}>Er dette ditt produkt?</Text>
            <FlatList
            data={this.state.dataSource}
            keyExtractor={({id}, index) => id}
            renderItem={({item}) => 
            <View style={{alignItems: "center"}}>
              <Text style= {styles.text}>Navn: {item.name}</Text>
              <View style={{flex: 1, flexDirection: "row", justifyContent: 'center' }}>
                <Text style= {styles.text}>Pris: </Text>
                <TextInput style={styles.text} underlineColorAndroid= "gray" placeholder={this.state.productPrice} onChangeText={(text) => this.setState({productPrice: text})}></TextInput>
              </View>
              <Text style= {styles.ean}>EAN-kode: {item.serial}</Text>
              <View style={styles.buttView}>
                <Button onPress={() => this.makeChange(this.state.productPrice)} title={"Legg til"}></Button>
              </View>
            </View>}
            />
          </View>
        </Modal>
        <BarCodeScanner style={StyleSheet.absoluteFill}
          onBarCodeScanned={this.handleBarCodeScanned}
        />
      </View>
    );
  };

  makeChange = (nypris) => {    
    let gammelpris = this.state.dataSource[0].pris.toString();
    if (gammelpris === nypris){
      let finalpris = parseInt(gammelpris) + parseInt(nypris);
      return fetch('http://192.168.1.45:3000/update/' + finalpris, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstParam: 'yourValue',
          secondParam: 'yourOtherValue',
        }),
      }).then((response) => response.json())
          .then((responseJson) => {
            return responseJson.movies;
          })
          .catch((error) => {
            console.error(error);
          });
    } else {
      alert("different")
    }

      

  }

  
  handleBarCodeScanned = ({ type, data }) => {
    return fetch('http://192.168.1.45:3000/products/' + data)
      .then((response) => response.json())
      .then((responseJson) => {
          this.setState({
            dataSource: responseJson.response,
            productPrice: responseJson.response[0].pris.toString(),
            isModalVisible: true,
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
    padding: 15,
  },
  X: {
    paddingRight: 10,
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "right",
  },
  heading: {
    fontSize: 25,
    textAlign: "center",
    paddingBottom: 35,
    paddingTop: 35,
  },
  text: {
    color: "orange",
    fontSize: 35,
    textAlign: 'center',
  },
  ean: {
    color: "orange",
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 30,
    fontSize: 12,
  },
  buttView: {
    width: 150,
  }
  
  
});

