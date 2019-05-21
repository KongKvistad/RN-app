import React from 'react';
import { StyleSheet, FlatList, View, Text, TextInput, Button, ToastAndroid, TouchableHighlight, AsyncStorage, Picker} from 'react-native';
import { BarCodeScanner, Permissions, Font, AuthSession } from 'expo';
import Modal from "react-native-modal";
import { withNavigation } from "react-navigation";
import FadeInView from '../components/animationview';

export default class HomeScreen extends React.Component {
  
  
  static navigationOptions = {
    title: 'Scan',
    tabBarLabel: ({ text }) => (
      <Text style={{fontFamily: "poetsenone", fontSize: 26, color: "white",shadowColor: "black", textShadowOffset: {width: 3,height: 2}}}>Legg til</Text>
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
      hasCameraPermission: null,
      onCodeRead: undefined,
      localEan: null,
      dataSource: null,
      possibleGroups: [],
      PickerValueHolder: "",
      isLoading: true,

    }
  }
  
  getGroups = () => {
    AsyncStorage.getItem("groups").then(response => {
      this.setState({
        possibleGroups: JSON.parse(response),
        isLoading: false,
      })                                
    })
  } 

  async componentDidMount() {
    AsyncStorage.getItem("groups").then(response => {
    this.setState({PickerValueHolder: JSON.parse(response)[0].group_id})
    })

    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    this.props.navigation.addListener("didFocus", () => {

      this.getGroups()
      
      this.setState({
        onCodeRead: this.handleBarCodeScanned,
      })
      //if navigation happened but not through button
      if(this.props.navigation.state.params === undefined){
        return
      
      } else {
          
          //if navigation did happen though button
          this.setState({
          PickerValueHolder: this.props.navigation.state.params.through_group,
        });
      }

    });
    this.props.navigation.addListener("didBlur", () => {
      this.setState({ onCodeRead: undefined });
      this.props.navigation.state.params = undefined
     });
      
    };
    

  _toggleModal = () =>{
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  }
  

  render() {
    const { hasCameraPermission } = this.state;

    const matchProduct = <Text style= {styles.heading}>{`Er dette ditt \nprodukt?`}</Text>;
    const newProduct = <Text style= {styles.heading}>{`Legg til nytt \nprodukt:`}</Text>

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (

      <View style={{ flex: 1, justifyContent: 'center', margin: 0, alignItems:"center"}}>
        {/* actual modal window */}

        <Modal isVisible={this.state.isModalVisible} animationIn={"bounceIn"} animationInTiming={1000} animationOut={"bounceOut"}>
        <Text style= {styles.X} onPress={this._toggleModal}>X</Text>
          <View style={styles.modalWind}>
            {this.state.dataSource === null || this.state.dataSource[0].id == 0 ? newProduct : matchProduct}
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
            <Text style={{bottom: 6, fontSize: 100, color: "white", textAlign: "center", fontFamily: "abel", fontWeight:"bold", shadowColor: "black", textShadowOffset: {width: 3,height: 2}}}>+</Text>
          </TouchableHighlight>
        </Modal>
        
        <View style={{zIndex: 3, alignItems: 'center', justifyContent: 'center'}}>
        <FadeInView style={{height: 200, justifyContent: "center", alignItems:"center", borderRadius: 10}}>
        </FadeInView>
        </View>
        <Text style={styles.GrOverskrift}>Aktiv gruppe:</Text>
        <View style={styles.GrCont}>
           {this.state.isLoading === false ? 
            <Picker
            style={styles.picker}
            selectedValue={this.state.PickerValueHolder}
 
            onValueChange={(itemValue, itemIndex) => this.setState({PickerValueHolder: itemValue})}>
 
            { this.state.possibleGroups.map((item, key)=>(
            <Picker.Item label={item.name} value={item.group_id} key={key} />)
            )}
    
          </Picker> :
          <Text>Loading...</Text>}
        </View>
        
        <BarCodeScanner style={StyleSheet.absoluteFill}
          onBarCodeScanned={this.state.onCodeRead}
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

  async checkOrigin() {
      const retrievedItem =  await AsyncStorage.getItem("id");
      const item = JSON.parse(retrievedItem);
      //if 
      return [this.state.dataSource[0].added_by == item && this.state.dataSource[0].through_group == this.state.PickerValueHolder ? this.state.dataSource[0].id : "0", item]
    }
  sendPost() {
    

    this.checkOrigin().then( res => {
    
    return fetch('https://serene-atoll-53191.herokuapp.com/update/' + res[0], {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serial: this.state.localEan,
          name: this.state.dataSource[0].name,
          price: this.state.dataSource[0].pris,
          through_group: this.state.PickerValueHolder,
          added_by: res[1],

        }),
      })
      .then(this._toggleModal)
      .catch((error) => {
        console.error(error);
      });
  })
  }
  
  handleBarCodeScanned = ({ data }) => {
    console.log(this.state.PickerValueHolder)
    AsyncStorage.getItem("id").then(response => {
      
    return fetch('https://serene-atoll-53191.herokuapp.com/products/' + data + "/" + response + "/" + this.state.PickerValueHolder)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.response)
          this.setState({
            dataSource: responseJson.response,
            localEan: data,
            isModalVisible: true,
          })
      })   
      //.catch((error) =>{
        //console.error(error);
      //});
    })
  }
}


const styles = StyleSheet.create({
  GrCont: {
    alignItems:"center",
    justifyContent: 'center',
    width: 180,
    height: 60,
    backgroundColor: "#FFB03C",
    zIndex:2,
    borderRadius: 5,
    top: 65,
   
  },
  picker: {
    height:50, 
    width:160,
    color: "white",
    alignItems: "center",
    justifyContent:"center"
  },

  GrOverskrift: {
    zIndex: 2,
    fontFamily:"poetsenone",
    color: "white",
    fontSize:29,
    shadowColor: "black",
    textShadowOffset: {width: 2,height: 2},
    top: 50

  },


  modalWind: {
    backgroundColor: "white",
    borderRadius: 60,
    padding: 8,
    top: 40
  },
  X: {
    fontSize: 40,
    left: 262,
    shadowColor: "black",
    textShadowOffset: {width: 1,height: 1},
    top: 80,
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
    fontFamily:"abel",
    borderRadius: 5,

    width: 130,
    backgroundColor: "#F3F3F3",

  },
  desc: {
    color: "#C4C4C4",
    fontSize: 35,
    textAlignVertical: "center",
    paddingBottom:5,
    fontFamily:"abel",
    paddingLeft: 5,
  
  },
  pris: {
    fontSize: 45,
  },
  ean: {
    color: "gray",
    textAlign: "center",
    fontFamily:"abel",
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
    height: 120,
    backgroundColor: "#FFB03C",

    left: 104,
    bottom: 30,
  },

  
  
});