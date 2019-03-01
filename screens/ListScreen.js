import React from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl, Dimensions } from 'react-native';




export default class ListScreen extends React.Component {
    static navigationOptions = {
      title: 'Oversikt',
      tabBarLabel: ({ text }) => (
        <Text style={{fontFamily: "poetsenone", fontSize: 26, color: "white", shadowColor: "black", textShadowOffset: {width: 3,height: 2}}}>Oversikt</Text>
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
        hasLoaded: null,
        refreshing: false,
      }
    };

    _onRefresh = () => {
      this.setState({refreshing: true});
      return fetch('https://serene-atoll-53191.herokuapp.com/getlist/' )
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
              hasLoaded: responseJson.response,
              refreshing: false
            })
        })   
        .catch((error) =>{
          console.error(error);
        });
    }
  
    componentDidMount () {
      this._onRefresh()
      let penis = Dimensions.get("window");
      console.log(penis)
      } 

    render() {
        return (
          <View style={styles.masterview}>
            <FlatList
            data={this.state.hasLoaded}
            keyExtractor={({id}, index) => id.toString()}
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
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