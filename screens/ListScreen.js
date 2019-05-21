import React from 'react';
import { FlatList, View, Text, StyleSheet, RefreshControl, Dimensions, Button, SectionList } from 'react-native';
import {createStackNavigator, createSwitchNavigator, NavigationEvents } from "react-navigation";




export default class ListScreen extends React.Component {

  
    static navigationOptions = ({ navigation }) => {
      return {          
        headerTitle: (<Text style={{fontFamily: "poetsenone", fontSize: 30, color: "white",shadowColor: "black", flex: 1, textAlign: "center", justifyContent: "center", right: 18, textShadowOffset: {width: 3,height: 2}}}>{navigation.state.params.ChosenName}</Text>),
        headerLeft: (
          <Text style={{fontFamily: "poetsenone", fontSize: 30, color: "white",shadowColor: "black", textShadowOffset: {width: 3,height: 2}}}
          onPress={() => navigation.navigate("Groups")}
          >  ◄</Text>
        ),
        headerStyle: {
            height: 60,
            backgroundColor: '#423D3D',
            textAlignVertical: "center",
          },

      };
    }

    constructor(props){
      super(props);
      this.state ={ 
        hasLoaded: [],
        refreshing: false,
        refreshId: this.props.navigation.state.params.ChosenGroup
      }
    };

    _onRefresh = (id) => {
      this.setState({refreshing: true});
      return fetch('https://serene-atoll-53191.herokuapp.com/getlist/' + this.state.refreshId )
        .then((response) => response.json())
        .then((responseJson) => {
         
            this.setState({
              hasLoaded: responseJson.response,
              refreshing: false
            })
            console.log("hello!", responseJson.response)
          
        })   
        .catch((error) =>{
          console.error(error);
        });
    }

  
    componentDidMount () {
      let id = this.props.navigation.state.params.ChosenGroup
    
      
      this._onRefresh(id)
      
     
      } 

    calculate =(data) => {
      total = 0, 
      data.forEach( i => {
        i.arr.forEach(j => {
          total = total + j.spend
        })
      });

      return total
    }

    render() {
      
     
        return (
          <View style={styles.masterview}>
            <View style = {styles.overhead}>
              <Text style = {styles.total}>Total:</Text>
              <Text style= {styles.OHtext}>{this.calculate(this.state.hasLoaded)}.-</Text>
            </View>
            <FlatList
            data={this.state.hasLoaded}
            keyExtractor={({user_id}, index) => user_id.toString()}
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
            renderItem={({item}) => 
            <View>
              <CustomComp data = {item}/>
            </View>

            
           
            
            }
            />
           
          </View>
        );
    };
}

const CustomComp = (props) =>{
  

  return(

    <SectionList
           sections={[
             { title: props.data.username, data: props.data.arr }
           ]}
           renderSectionHeader={ ({section}) => <Text style= {styles.text}> { section.title } </Text> }
           renderItem={ ({item}) => 
           <View style ={styles.line}>
            <Text style= {styles.listitems}> { item.name } </Text> 
            <Text style= {styles.listitems}> { item.spend }.- </Text>
           </View> }
           keyExtractor={ (item, index) => index }
         />

    );
}

const styles = StyleSheet.create({
  masterview:{
    flex: 1
  },

  overhead: {
    left: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 320,
    height: 70,
    backgroundColor: "orange",
    borderRadius: 10,
    marginBottom: 30,
    marginTop: 30,
  },

  OHtext: {
    fontFamily: 'poetsenone',
    fontSize: 40,
    color: 'white',
    paddingRight: 20,


  },
  total: {
    fontFamily: 'poetsenone',
    fontSize: 40,
    color: 'white',
    paddingLeft: 20,
    
    
  },

  line:{
    flex: 1,
    flexDirection: "row",
    
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between',

  },
  text: {
    fontFamily: 'abel',
    fontSize:26,

    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#fbdec0",
    paddingLeft: 20,
  },
  listitems: {
    fontFamily: 'abel',
    fontSize:22,
    paddingLeft: 30,
    paddingRight: 30
    
  },

});
