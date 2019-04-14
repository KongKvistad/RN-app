import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  View,
} from 'react-native';
import {Svg} from "expo";

import * as memberinfo from '../assets/memberinfo.json';


export default class ListyList extends React.Component {

	constructor(props) {
    	super(props);
    	this.state = {
       isclicked: "red",
       numcols: memberinfo.kollektivet,
       data: [],
 		};
  
   }
   
  renderCanvas = (chosenGroup) => {
    this.setState({
      numcols: memberinfo[chosenGroup]
    })

    
  }
componentDidMount () {
  this.retrieveItem("id", "username", "password", "groups").then((goals) => {
    
      
    
    console.log("pre-append:", this.state.data)
    this.state.data.forEach(e => {
      this.getMembers(e.group_id)
    })
  })  
}
getMembers = async (id) => {
  let arr = []
  await fetch('http://192.168.1.48:3000/groupmembers/' + id)
        .then( res => res.json())
        .then( res =>  {
          res.response.forEach(e => {
            arr.push(e)
          })  
        })
        console.log(arr)
}

  
  async retrieveItem(key1, key2, key3, key4) {
    try {
      const retrievedItem =  await AsyncStorage.multiGet([key1, key2, key3, key4])
      const item = JSON.parse(retrievedItem[3][1])
      return item
    } catch (error) {
      console.log(error.message);
    }
    return
  }


  
 	

  handlerButtonOnClick = (item) => {
    this.renderCanvas(item.name)

  	this.setState({
      isclicked: item.id,
  		refresh: !this.state.refresh
    })
    //this.props.navigation.navigate('List');
    }
  navigate=(clickedGroup)=> {
    //props passed in from groupscreenjs:
    const {navigate} = this.props.navigation
    navigate('List')
  }

  render() {
    //sjekk denne senere
    

    return(
      <View style={styles.masterview}>
        <View style = {styles.canvas}>
          <FlatList
          
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          horizontal = {true}
          data={this.state.numcols}
          keyExtractor={({id}, index) => id.toString()}
          renderItem={({item}) => 
          <MakeCanvas memberData = {item} numcols = {this.state.numcols}  />
          }
          />
        </View>
    	<FlatList
  		data={this.state.data}
  		keyExtractor={({group_id}) => group_id.toString()}
  		extraData={this.state.refresh}
  		renderItem={({item}) => 
        <TouchableOpacity onPress= {() => this.handlerButtonOnClick(item)}
        style={[
          styles.userListText, 
          { 
              backgroundColor: this.state.isclicked  === item.group_id ? '#DFDFDF' : 'white'
          }]} 
        >
          <View style= {{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={styles.text}>{item.name}</Text>
            <TouchableHighlight style ={styles.button} onPress={() => this.navigate(item.id)}>
              <Text style= {{fontFamily: "poetsenone", color: "white"}}>se mer ►</Text>
            </TouchableHighlight>
          </View>
          <Text numberOfLines={1} style={[styles.label, {width: 230}]}>{item.members}</Text>   
        </TouchableOpacity>
  		}
		  />
    </View>

   	); 
  }
}

const MakeCanvas = (props) => {
  
  let spending = props.memberData.spending
  let divisor = props.numcols.length 
  
  
  let randomfill = ["#FFC46D", "#FFB343", "#FFA520", "#E29420", "#D29945", "#BB945B"]
  let maximum = 5;
  let minimum = 1;
  let randomNumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  return (
    <View>
    <Text style = {{transform: [{ scaleY: -1 }], marginLeft: (100 / divisor) - 15}}>{spending}</Text>
    <Svg height={200} width={200 / divisor}>
      <Svg.Rect
      x={(100 / divisor) - 15}
      y={0}
      width={30}
      height={spending}
      fill={randomfill[randomNumber]}
      />
    </Svg>
    </View>
  );
}

const styles = StyleSheet.create({      
    userListText: {
        color: '#333',
        backgroundColor: "blue"

    },
    masterview:{
      padding: 10,
    },
    text: {
      fontFamily: 'poetsenone',
      fontSize:30,
      paddingTop: 10,
    },
    label: {
      fontFamily: 'PoorStory',
      fontSize:30,
      textAlign: "left",
      borderRadius: 5,
      paddingTop: 10,
      
    },
    masterview:{
      padding: 10,
    }, 
    canvas: {
      borderWidth: 2,
      transform: [{ scaleY: -1 }]
    },
    button: {
      backgroundColor: "orange",
      borderRadius: 10,
      width: 70,
      height: 40,
      top: 20,
      justifyContent:"center",
      alignItems : "center"

    }

});


