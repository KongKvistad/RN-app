
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


export default class ListyList extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
       isclicked: null,
       numcols: null,
       data: props.groups,
       total: 0,
    };
  
   }

   
 
componentWillReceiveProps(props) {
  this.setState({
    data: props.groups
  })
}



  handlerButtonOnClick = (item, index) => {
    let total = 0;
    item.arr.forEach(e => {
      total = total + e.spend
    })

      this.setState({
        isclicked: item.group_id,
        refresh: !this.state.refresh,
        numcols: this.state.data[index].arr,
        total: total
      })

    //this.props.navigation.navigate('List');
    }
    navigateToList=(clickedGroup)=> {
    console.log("click:", clickedGroup.group_id)
   
    this.props.navigation.navigate("list", 
      {
        ChosenGroup: clickedGroup.group_id,
        ChosenName: clickedGroup.name
      })
    
    //props passed in from groupscreenj
    }

    navigateToProduct=() => {
      AsyncStorage.multiGet(["id", "groups"]).then(response => {
        
        let groupname = ""

        JSON.parse(response[1][1]).forEach(e => {
            if(e.group_id == this.state.isclicked) {
              groupname = e.name
            }
          })

        this.props.navigation.navigate("Home", 
        {
          added_by: response[0][1],
          through_group: this.state.isclicked,
          groupname: groupname
        })
      })
    }

rendernames = (item) =>{
  
    item.members = [] 
    item.arr.forEach( e => {
      item.members.push(e.username + ", ")
    });

    return item

}
  render() {
    const { numcols } = this.state;
    const produktKnapp = <TouchableOpacity style = {styles.produktKnapp} onPress={() => this.navigateToProduct()}>
                          <Text style= {{color: "white", fontFamily: "poetsenone", fontSize: 18}}>Legg til produkt</Text>
                         </TouchableOpacity>;
    
    const nullVerdi = null;

    return(
      <View style={styles.masterview}>
        <View style = {styles.canvas}>
           {this.state.isclicked === null ? nullVerdi : produktKnapp}
          <FlatList
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          horizontal = {true}
          data={numcols}
          keyExtractor={({user_id, index}) => user_id.toString()}
          extraData={this.state.total}
          renderItem={({item, index}) => 
          <MakeCanvas memberData = {item} numcols = {this.state.numcols} totalAmount = {this.state.total}  />
          }
          />
        </View>
      <FlatList
      data={this.state.data}
      keyExtractor={({group_id, index}) => group_id.toString()}
      extraData={this.state.refresh}
      renderItem={({item, index}) => 
        <TouchableOpacity onPress= {() => this.handlerButtonOnClick(item, index)}
        style={[
          styles.userListText, 
          { 
              backgroundColor: this.state.isclicked  === item.group_id ? '#DFDFDF' : 'white'
          }]} 
        >
          <View style= {{flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={styles.text}>{item.name}</Text>
            <TouchableHighlight style ={styles.button} onPress={() => this.navigateToList(item)}>
              <Text style= {{fontFamily: "poetsenone", color: "white"}}>se mer ►</Text>
            </TouchableHighlight>
          </View>
          <Text numberOfLines={1} style={[styles.label, {width: 240}]}>{this.rendernames(item).members}</Text>   
        </TouchableOpacity>
      }
      />
    </View>

    ); 
  }
}

const MakeCanvas = (props) => {
  const total = props.totalAmount
  let spending = props.memberData.spend
  let divisor = props.numcols.length 
  let members = props.memberData.username

  
  makeUp =(input) => {
    if (input === null || input === undefined) {
      return 0
    } else {
      // get percentage
      return input / total * 100
    }
  } 
  
  
  let randomfill = ["#FFC46D", "#FFB343", "#FFA520", "#E29420", "#D29945", "#BB945B"]
  let maximum = 5;
  let minimum = 1;
  let randomNumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  return (
    <View>
    <Text style = {{transform: [{ scaleY: -1 }], marginLeft: (100 / divisor) - 15}}>{makeUp(spending).toFixed(2) + "%"}</Text>
    <Text style = {{transform: [{ scaleY: -1 }], marginLeft: (100 / divisor) - 15}}>{members.substring(0, 7)}</Text>
    <Svg height={150} width={200 / divisor}>
      <Svg.Rect
      x={(100 / divisor) - 15}
      y={0}
      width={34}
      height={makeUp(spending)}
      fill={randomfill[randomNumber]}
      />
    </Svg>
    </View>
  );
}

const styles = StyleSheet.create({      
    userListText: {
        borderRadius: 10

    },

    text: {
      fontFamily: 'poetsenone',
      fontSize:30,
      paddingTop: 10,
      paddingLeft: 15,
    },
    label: {
      fontFamily: 'abel',
      fontSize:20,
      textAlign: "left",
   
      paddingTop: 5,
      paddingBottom: 10,
      paddingLeft: 15,
      
    },
    masterview:{
      padding: 0,
    }, 
    canvas: {
      transform: [{ scaleY: -1 }],
      alignItems:"center"
    },
    button: {
      backgroundColor: "orange",
      borderRadius: 10,
      width: 74,
      height: 40,
      top: 25,
      justifyContent:"center",
      alignItems : "center",
      marginRight: 15,

    },
    produktKnapp: {
      transform: [{ scaleY: -1 }],
      backgroundColor: "orange",
      borderRadius: 5,
      width: 150,
      marginTop: 15,
      marginBottom: 15,
      height: 40,
      justifyContent:"center",
      alignItems : "center",
    }

});
