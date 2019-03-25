import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
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
     	dataSource: [{
        "id": 1,
        "name": "kollektivet",
        "members": "eirik, kristian, erland, hannah"
      },
      {
        "id": 2,
        "name": "naboen",
        "members": "rand1, rand2, rand3"
      },
      {
        "id": 3,
        "name": "random",
        "members": "rand1, rand2, rand3, rand4, rand5"
      }], 
 		};

   }
   
  renderCanvas = (chosenGroup) => {
    this.setState({
      numcols: memberinfo[chosenGroup]
    })

    
  }
 	

  handlerButtonOnClick = (item) => {
    this.renderCanvas(item.name)

  	this.setState({
      isclicked: item.id,
  		refresh: !this.state.refresh
    })
    //this.props.navigation.navigate('List');
    }


  render() {
    //sjekk denne senere
    

    return(
      <View style={styles.masterview}>
        <View style = {styles.canvas}>
          <FlatList
          
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          horizontal = {true}
          //replace this with numcols when possible
          data={this.state.numcols}
          keyExtractor={({id}, index) => id.toString()}
          renderItem={({item}) => 
          <MakeCanvas memberData = {item} numcols = {this.state.numcols}  />
          }
          />
        </View>
    	<FlatList
  		data={this.state.dataSource}
  		keyExtractor={({id}) => id.toString()}
  		extraData={this.state.refresh}
  		renderItem={({item}) => 
        <TouchableOpacity onPress= {() => this.handlerButtonOnClick(item)}
        style={[
          styles.userListText, 
          { 
              backgroundColor: this.state.isclicked  === item.id ? 'gray' : 'white'
          }]} 
        >
          <Text style={styles.text}>{item.name}</Text>
          <Text style={styles.label}>{item.members}</Text>   
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
    },
    label: {
      fontFamily: 'PoorStory',
      fontSize:30,
      textAlign: "left",
      borderRadius: 5,
    },
    masterview:{
      padding: 10,
    }, 
    canvas: {
      borderWidth: 2,
      transform: [{ scaleY: -1 }]
    },

});


