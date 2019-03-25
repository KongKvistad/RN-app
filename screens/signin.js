import React from 'react';
import { Button, View, AsyncStorage, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';

import { AuthSession, } from 'expo';
import { TextInput } from 'react-native-gesture-handler';


export default class SignInScreen extends React.Component {
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
        <KeyboardAvoidingView>
        <TextInput style = {styles.text} placeholder={"brukernavn.."} placeholderTextColor="gray" onChangeText={(text) => {this.state.localStore.username = text}}></TextInput>
        <TextInput style = {styles.text} placeholder={"passord.."} placeholderTextColor="gray" onChangeText={(text) => {this.state.localStore.password = text}}></TextInput>
        <Button title="Sign in!" onPress={this._signInAsync} />
        </KeyboardAvoidingView>
      </View>
    );
  }
  
  _signInAsync = async () => {
    await AsyncStorage.multiSet([['username', JSON.stringify(this.state.localStore.username)], ["password", JSON.stringify(this.state.localStore.username)]]);
    this.props.navigation.navigate('App');
  };

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFB03C",
        alignItems: "center"
    },
    Image: {
        top: 30,
        width: 330,
        resizeMode: 'contain',
        marginBottom: 90,
    },
    text: {
        
        color: "orange",
        fontSize: 35,
        textAlign: 'left',
        fontFamily:"PoorStory",
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 10,
    
        width: 230,
        backgroundColor: "#F3F3F3",


    }
})
