import React from 'react';
import { StyleSheet, FlatList, View, Text, TextInput, Button, ToastAndroid } from 'react-native';
import { BarCodeScanner, Permissions, Font } from 'expo';
import Modal from "react-native-modal";

export default class HomeScreen extends React.Component {
  
  static navigationOptions = {
    title: 'Scan',
    tabBarOptions: {
      labelStyle: {
        fontSize: 20,
        //fontFamily: "poetsenone"
      },
      tabStyle: {

      },
      style: {
        marginTop: 23,
        backgroundColor: '#423D3D',
        //fontFamily: "poetsenone"
        
      },
    }
  };

  constructor(props){
    super(props);
    this.sendPost = this.sendPost.bind(this);
    this.state ={ 
      isModalVisible: false,
      dataSource: null,
      hasCameraPermission: null,
      localEan: null,
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
            <Text style= {styles.heading}>{`Er dette ditt \nprodukt?`}</Text>
            <FlatList
            data={this.state.dataSource}
            keyExtractor={({id}, index) => id.toString()}
            renderItem={({item}) => 
            <View style={{alignItems: "center"}}>
              <View style={{flex: 1, flexDirection: "row", justifyContent: 'center' }}>
                <Text style= {styles.text}>Navn: </Text>
                <TextInput style={styles.text} placeholder={item.name} placeholderTextColor="gray" onChangeText={(text) => {this.state.dataSource[0].name = text}}></TextInput>
              </View>
              <View style={{flex: 1, flexDirection: "row", justifyContent: 'flex-start' }}>
                <Text style= {styles.text}>Pris: </Text>
                <TextInput style={styles.text} placeholder={item.pris.toString()} placeholderTextColor="gray" onChangeText={(text) => {this.state.dataSource[0].pris = text}}></TextInput>
              </View>
              <Text style= {styles.ean}>EAN-kode: {this.state.localEan}</Text>
              <View style={styles.buttView}>
                <Button onPress={() => this.makeChange()} title={"Legg til 1 stk."}></Button>
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


  makeChange = () => {    
    let ean = this.state.localEan;
    let serial = this.state.dataSource[0].serial

    if (ean !== serial) {
      this.sendPost()
      ToastAndroid.show("la til nytt produkt!", ToastAndroid.SHORT);
    
    } else if (ean === serial) {
      this.sendPost()
      ToastAndroid.show(`La til 1 stk. ${this.state.dataSource[0].name}`, ToastAndroid.SHORT);
    }
  }
  sendPost() {
    return fetch('http://192.168.1.48:3000/update/' + this.state.dataSource[0].id, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serial: this.state.localEan,
          type: 30,
          name: this.state.dataSource[0].name,
          price: this.state.dataSource[0].pris,

        }),
      })
      .then(this.setState({
        isModalVisible: false,
      }))
      .catch((error) => {
        console.error(error);
      });
  }
  
  handleBarCodeScanned = ({ data }) => {
    return fetch('http://192.168.1.48:3000/products/' + data)
      .then((response) => response.json())
      .then((responseJson) => {
          this.setState({
            dataSource: responseJson.response,
            localEan: data,
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
    borderRadius: 50,
    padding: 20,
  },
  X: {
    paddingRight: 10,
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "right",
  },
  heading: {
    fontSize: 40,
    textAlign: "center",
    paddingBottom: 35,
    paddingTop: 35,
    fontFamily: 'poetsenone',
  },
  text: {
    color: "orange",
    fontSize: 35,
    textAlign: 'center',
    paddingBottom:5,
    
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