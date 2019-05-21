import React from 'react';
import { Button, View, AsyncStorage, Image, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Text } from 'react-native';

import { AuthSession, } from 'expo';
import { TextInput } from 'react-native-gesture-handler';


export default class RegScreen extends React.Component {
  static navigationOptions = {
    header: null
    
  };
  
  
  constructor(props){
    super(props);
    this.state ={ 
      localStore: {
        username:"",
        password:""
      }
    
    }
  }
  

  render() {
    return (
      <View style = {styles.container}>
        <View style ={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <TextInput style = {styles.text} placeholder={"Brukernavn.."} placeholderTextColor="white" onChangeText={(text) => {this.state.localStore.username = text}}></TextInput>
        <TextInput style = {styles.text} placeholder={"Passord.."} placeholderTextColor="white" onChangeText={(text) => {this.state.localStore.password = text}}></TextInput>
        
        <TouchableOpacity style ={styles.loginbutton} onPress={this._registerAsync}>
          <Text style={{fontFamily:"abel", fontSize: 18}}>Registrer deg</Text>
        </TouchableOpacity>
        </View>  
      </View>
    );
  }
  _registerAsync = async () => {
    //await AsyncStorage.multiSet([['username', JSON.stringify(this.state.localStore.username)], ["password", JSON.stringify(this.state.localStore.username)]]);
    await fetch('https://serene-atoll-53191.herokuapp.com/RegUser', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username:this.state.localStore.username.trim(),
          password:this.state.localStore.password.trim(),
        }),
      })
      .then( res => res.json())
      .then( res => {
        if (res.status === 404){
          alert(res.response)
        } else{
          this.storeItem(JSON.stringify(res.response.insertId),JSON.stringify(this.state.localStore.username), JSON.stringify(this.state.localStore.password));
          this.retrieveItem("id", "username", "password")
          this.props.navigation.navigate('SignIn'); 
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  async storeItem(id, username, password) {
    try {
        //we want to wait for the Promise returned by AsyncStorage.setItem()
        //to be resolved to the actual value before returning the value
        var jsonOfItem = await AsyncStorage.multiSet([['id', id], ['username', username], ["password", password]]);
        return jsonOfItem;
    } catch (error) {
      console.log(error.message);
    }
  }

  async retrieveItem(key1, key2, key3) {
    try {
      const retrievedItem =  await AsyncStorage.multiGet([key1, key2, key3])
      console.log(retrievedItem[0][1], retrievedItem[1][1], retrievedItem[2][1]);
    } catch (error) {
      console.log(error.message);
    }
    return
  }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFB03C",
        alignItems: "center",
        justifyContent: "center",
    },
    Image: {
        top: 60,
        width: 330,
        resizeMode: 'contain',
        marginBottom: 90,
    },
    text: {
        
        color: "white",
        fontSize: 30,
        textAlign: 'left',
        fontFamily:"abel",
        paddingLeft: 10,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "white",
    
        width: 230,
        


    },
    loginbutton: {
      width: 120,
      height:40,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems:"center",
      borderRadius: 10
    }
})
