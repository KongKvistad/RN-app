import React from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl, Dimensions, TouchableOpacity, AsyncStorage } from 'react-native';
import {Svg} from "expo";
import ListyList from '../components/grouplabel';



export default class GroupScreen extends React.Component {
    static navigationOptions = {
        title: 'grupper',
        tabBarLabel: ({ text }) => (
          <Text style={{fontFamily: "poetsenone", fontSize: 26, color: "white",shadowColor: "black", textShadowOffset: {width: 3,height: 2}}}>grupper</Text>
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
        this.state ={ 
          hasLoaded: [
              {
                "id": 1,
                "name": "kollektivet",
                "members": "eirik, kristian, erland"
              },
              {
                "id": 2,
                "name": "random",
                "members": "rand1, rand2, rand3"
              },
              {
                "id": 3,
                "name": "random",
                "members": "rand1, rand2, rand3, rand4, rand5"
              },
          ],
          
          localStore: "",
          numcols: 200
        };
      
      };
      
   



      

      render() {
        
        
        
        return (
          <View style={styles.masterview}>
            <ListyList navigation = {this.props.navigation}/>
            <Text>{this.state.localStore}</Text>
          </View>
        );
    };
}

const styles = StyleSheet.create({
    masterview:{
      padding: 10,
    },
    container:{
      flex: 1,
      flexDirection: "column",
      paddingTop: 15,
      paddingBottom: 15,
      justifyContent: 'space-between',

      backgroundColor: "#FFB03C",
      opacity: 0.5,
      borderRadius: 5,
  
    },
    containerPress: {
      backgroundColor: "blue",
    },
    
    
    canvas: {
      borderWidth: 2,
    },
    svg : {
      flex: 1,
      flexDirection: "row"
    }
  
  });

  
