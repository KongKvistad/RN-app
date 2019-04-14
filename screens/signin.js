import React from 'react';
import { Button, View, AsyncStorage, Image, StyleSheet, KeyboardAvoidingView, Text } from 'react-native';

import { AuthSession, } from 'expo';
import { TextInput } from 'react-native-gesture-handler';


export default class SignInScreen extends React.Component {
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
        <Image
          style={styles.Image}
          source={require('../assets/images/komodo2.png')}
        />
        <View style ={{flex: 1, alignItems: "center"}}>
        <TextInput style = {styles.text} placeholder={"brukernavn.."} placeholderTextColor="white" onChangeText={(text) => {this.state.localStore.username = text}}></TextInput>
        <TextInput style = {styles.text} placeholder={"passord.."} placeholderTextColor="white" onChangeText={(text) => {this.state.localStore.password = text}}></TextInput>
        
        <Button title="Sign in!" onPress={this._signInAsync} />
        <Text style = {{textDecorationLine: 'underline', paddingTop: 15}} onPress= {() => this.props.navigation.navigate("RegUser")}>ikke registrert?</Text>
        </View>
      </View>
    );
  }
  
  _signInAsync = async () => {
    
    await fetch('http://192.168.1.48:3000/CheckUser', {
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
          this.storeItem(JSON.stringify(res.response[0].user_id),JSON.stringify(res.response[0].username), JSON.stringify(res.response[0].password));
          //this.props.navigation.navigate('App');
          this.getGroups(res.response[0].user_id)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  getGroups = async (id) => {
    await fetch('http://192.168.1.48:3000/getgroups/' + id)
          .then( res => res.json())
          .then( res =>  {
            try {
              //we want to wait for the Promise returned by AsyncStorage.setItem()
              //to be resolved to the actual value before returning the value
              var jsonOfItem = AsyncStorage.setItem("groups", JSON.stringify(res.response));
              this.retrieveItem("id", "username", "password", "groups")
              return jsonOfItem;
              } catch (error) {
                console.log(error.message);
              }
              
          })
          this.props.navigation.navigate('App')   
  }

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

  async retrieveItem(key1, key2, key3, key4) {
    try {
      const retrievedItem =  await AsyncStorage.multiGet([key1, key2, key3, key4])
      //console.log(JSON.parse(retrievedItem[3][1]));
      return retrievedItem
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
        alignItems: "center"
    },
    Image: {
        top: 60,
        width: 330,
        resizeMode: 'contain',
        marginBottom: 90,
    },
    text: {
        
        color: "white",
        fontSize: 35,
        textAlign: 'left',
        fontFamily:"PoorStory",
        paddingLeft: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "white",
    
        width: 230,
        


    }
})
