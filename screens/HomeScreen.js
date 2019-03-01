import React from 'react';
import { StyleSheet, FlatList, View, Text, TextInput, Button, ToastAndroid, TouchableHighlight } from 'react-native';
import { BarCodeScanner, Permissions, Font, AuthSession } from 'expo';
import Modal from "react-native-modal";
import { withNativeAd } from 'expo/build/facebook-ads';

export default class HomeScreen extends React.Component {
  
  
  static navigationOptions = {
    title: 'Scan',
    tabBarLabel: ({ text }) => (
      <Text style={{fontFamily: "poetsenone", fontSize: 30, color: "white",shadowColor: "black", textShadowOffset: {width: 3,height: 2}}}>Scan</Text>
    ),
    tabBarOptions: {
      indicatorStyle: {
        backgroundColor: "#FFB03C"
      },
      style: {
        height: 60,
        marginTop: 23,
        backgroundColor: '#423D3D',
        textAlignVertical: "center"
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
      <View style={{ flex: 1, justifyContent: 'center', margin: 0}}>
        {/* actual modal window */}
        <Modal isVisible={this.state.isModalVisible} animationIn={"bounceIn"} animationInTiming={1000}>
        <Text style= {styles.X} onPress={this._toggleModal}>X</Text>
          <View style={styles.modalWind}>

            <Text style= {styles.heading}>{`Er dette ditt \nprodukt?`}</Text>
            <FlatList
            data={this.state.dataSource}
            keyExtractor={({id}, index) => id.toString()}
            renderItem={({item}) => 
            //text container
            <View style={{flex: 1, flexDirection: "column", alignItems: "center"}}>
              <View style={{flex: 1, flexDirection: "row", justifyContent: 'space-between',width: 220, marginBottom: 10 }}>
                <Text style= {styles.desc}>Navn: </Text>
                <TextInput style={styles.text} placeholder={item.name} placeholderTextColor="gray" onChangeText={(text) => {this.state.dataSource[0].name = text}}></TextInput>
              </View>
              <View style={{flex: 1, flexDirection: "row", justifyContent: 'space-between', width: 220, marginBottom: 10}}>
                <Text style= {[styles.desc, styles.pris]}>Pris: </Text>
                <TextInput style={styles.text} placeholder={item.pris.toString()} placeholderTextColor="gray" onChangeText={(text) => {this.state.dataSource[0].pris = text}}></TextInput>
              </View>
              <Text style= {styles.ean}>EAN-kode: {this.state.localEan}</Text>
            </View>}
            />
          </View>
          {/* add button */}
          <TouchableHighlight
          style={styles.button}
          onPress={() => this.makeChange()}>
            <Text style={{fontSize: 100, color: "white", textAlign: "center", fontFamily: "poetsenone", shadowColor: "black", textShadowOffset: {width: 3,height: 2}}}>+</Text>
          </TouchableHighlight>
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
    return fetch('https://serene-atoll-53191.herokuapp.com/update/' + this.state.dataSource[0].id, {
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
    return fetch('https://serene-atoll-53191.herokuapp.com/products/' + data)
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
    borderRadius: 60,
    padding: 5,
  },
  X: {
    fontSize: 40,
    left: 262,
    shadowColor: "black",
    textShadowOffset: {width: 1,height: 1},
    top: 43,
    zIndex: 3,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: 50,
    fontFamily: "PoorStory",
    width: 55,
    color: "#FFB03C"
  },
  heading: {
    fontSize: 40,
    textAlign: "center",
    paddingBottom: 35,
    paddingTop: 35,
    color: "#423D3D",
    fontFamily: 'poetsenone',
  },
  text: {
    color: "orange",
    fontSize: 35,
    textAlign: 'center',
    fontFamily:"PoorStory",
    borderRadius: 5,

    width: 130,
    backgroundColor: "#F3F3F3",

  },
  desc: {
    color: "#C4C4C4",
    fontSize: 35,
    textAlignVertical: "center",
    paddingBottom:5,
    fontFamily:"PoorStory",
    paddingLeft: 5,
  
  },
  pris: {
    fontSize: 45,
  },
  ean: {
    color: "gray",
    textAlign: "center",
    fontFamily:"PoorStory",
    paddingTop: 10,
    paddingBottom: 80,
    fontSize: 18,
  },
  buttView: {
    width: 150,
  },
  button: {
    
    justifyContent: "center",
    borderRadius: 60,
    width: 120,
    backgroundColor: "#FFB03C",

    left: 104,
    bottom: 62,
  }
  
  
});