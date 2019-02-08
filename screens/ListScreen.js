import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';




export default class ListScreen extends React.Component {
    static navigationOptions = {
      title: 'Oversikt',
      tabBarOptions: {
        labelStyle: {
          fontSize: 12,
        },
        tabStyle: {
  
        },
        style: {
          marginTop: 23,
          backgroundColor: '#423D3D',
        },
      }
    };

    constructor(props){
      super(props);
      this.state ={ 
        hasLoaded: null,
      }
    };

    componentDidMount () {
      return fetch('http://192.168.1.48:3000/getlist/' )
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
              hasLoaded: responseJson.response
            })
        })   
        .catch((error) =>{
          console.error(error);
        });
        
      } 

    render() {
        return (
          <View style={styles.masterview}>
            <FlatList
            data={this.state.hasLoaded}
            keyExtractor={({id}, index) => id.toString()}
            renderItem={({item}) => 
            <View style={styles.container}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.label}>{item.spend}.-</Text>
            </View>
            }
            />
          </View>
        );
    };
}

const styles = StyleSheet.create({
  masterview:{
    padding: 30,
  },
  container:{
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 2,
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'space-between',

  },
  text: {
    fontFamily: 'PoorStory',
    fontSize:30,
  },
  label: {
    fontFamily: 'PoorStory',
    fontSize:30,
    backgroundColor: "#F3F3F3",
    width: 100,
    textAlign: "center",
    borderRadius: 5,
  },

});
