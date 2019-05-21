import React from 'react';
import { Button, FlatList,TextInput, View, Text, StyleSheet, RefreshControl, Dimensions, TouchableOpacity, AsyncStorage ,TouchableHighlight, ToastAndroid, ScrollView} from 'react-native';
import {Svg} from "expo";
import ListyList from '../components/grouplabel';



export default class GroupScreen extends React.Component {
    static navigationOptions = {
        title: 'grupper',
        tabBarLabel: ({ text }) => (
          <Text style={{fontFamily: "poetsenone", fontSize: 26, color: "white",shadowColor: "black", textShadowOffset: {width: 3,height: 2}}}>Grupper</Text>
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
          dataSource: [],
          displayData: [],
          form: {
           name: "",
           members: [] 
          },
          isClicked: false,
          passProps: []
        }
        
      };
      
      getPeople = async () => {
        await fetch('https://serene-atoll-53191.herokuapp.com/getpeople')
              .then( res => res.json())
              .then( responseJson =>  {
                this.setState({
                  dataSource: responseJson.response,
                })
                  
              })  
      }

      searchFilterFunction = text => {    
        const newData = this.state.dataSource.filter(item => {      
          const itemData = `${item.username.toUpperCase()}`;
          const textData = text.toUpperCase();
            
          return itemData.indexOf(textData) > -1;    
        });    
        this.setState({ displayData: text.length === 0 ? null : newData }); 
      }

      memberhandler = (item, index) => {
        this.state.dataSource.forEach(e => {
          if (e.user_id === item.user_id) {
            this.setState({
              form:{
                name: this.state.form.name,
                members: this.state.form.members.concat([item])
              }
            })
            console.log(this.state.form)
          }
        })
        this.setState({
          dataSource: this.state.dataSource.filter(function(el) { return el != item }),
        })
        this.searchFilterFunction("")

      }
      getGroups = async(id, update) => {
         await fetch('https://serene-atoll-53191.herokuapp.com/getgroups/' + id)
              .then( res => res.json())
              .then( res =>  { 
                if(res.status === 200 && update === false) {
                  AsyncStorage.setItem("groups", JSON.stringify(res.response)).then(response => {
                    this.clearForm()
                  })
                } else if (res.status === 200 && update === true) {
                  AsyncStorage.setItem("groups", JSON.stringify(res.response))
                  .then(AsyncStorage.getItem("groups").then(response => {
                      this.setState({passProps: JSON.parse(response)})
                    }))
                } else {
                  alert("server error!")
                }            
              })
      }
      clearForm =() => {
        ToastAndroid.show(`lagde gruppen ${this.state.form.name}!`, ToastAndroid.SHORT),
        AsyncStorage.multiGet(["id", "username", "groups"]).then(response => {
          this.setState({
            passProps: JSON.parse(response[2][1]),
            isClicked: false,
            form: {
             name: "",
             members: [{
              user_id: parseInt(response[0][1]),
              username: JSON.parse(response[1][1])
             }]  
            }
          })
        })
      }


      sendPost() {
        let newarr = [];

        this.state.form.members.forEach(e => {
          newarr.push(e.user_id)
        })
        //establishes new group
        return fetch('https://serene-atoll-53191.herokuapp.com/establishGroup', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              users: newarr,
              groupname: this.state.form.name,

            }),
          })
          .then(res => res.json())
          .then(response => {
            if(response.status === 200) {
              AsyncStorage.getItem("id").then(response => {
                this.getGroups(response, false)
              }) 
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }

     _showScreen = () => {
      this.setState({
        isClicked:!this.state.isClicked,
      })
     }

      componentDidMount() {
        this.getPeople()

        AsyncStorage.multiGet(["id", "username", "groups"]).then(response => {
          this.setState({
            passProps: JSON.parse(response[2][1]),
            form: {
             name: "",
             members: [{
              user_id: parseInt(response[0][1]),
              username: JSON.parse(response[1][1])
             }] 
            }
          })

          this.props.navigation.addListener("didFocus", () => {
            this.getGroups(response[0][1], true)
          })
        })  
      }

       render() {

        const plussOrMinus = this.state.isClicked === true ? "-" : "+"

        return (
          <ScrollView style={styles.masterview}>
            <View style={styles.newGroup}>
              <Text style = {styles.gruppetext}>Lag ny gruppe</Text>
              <TouchableHighlight style ={styles.button}>
                <Text style={{fontSize: 80, color: "white", fontWeight:"bold", bottom: 25, textAlign: "center",textAlignVertical: "center", fontFamily: "abel", shadowColor: "black", textShadowOffset: {width: 1,height: 1}}}
                 onPress={this._showScreen}>{plussOrMinus}</Text>
              </TouchableHighlight>
            </View>
              {this.state.isClicked === true ? 
              <View style={styles.modalWind}>
                <View style= {styles.inputRow}>
                  <TextInput style = {[styles.textinput, {width: 310}]} placeholder={"Gruppenavn..."} onChangeText={(text) => {this.state.form.name = text}} ></TextInput>
                </View>
              
                <View style= {styles.medlemRow}>
                  <TextInput style = {styles.textinput}placeholder={"medlemmer..."} onChangeText={text => this.searchFilterFunction(text)} ></TextInput>
                  <TouchableOpacity style ={styles.registrer} onPress = {() => this.sendPost()}>
                    <Text style = {{fontFamily: "poetsenone", fontSize: 17, color: "white"}} >Lag gruppe</Text>
                  </TouchableOpacity>
                </View>
                <FlatList style = {styles.resultrow}
                  contentContainerStyle={{alignItems: "center"}}
                  data={this.state.displayData}
                  keyExtractor={({user_id}, index) => user_id.toString()}
                  renderItem={({item, index}) => 
                  <TouchableOpacity style= {styles.user} onPress = {() => this.memberhandler(item, index)}>
                    <Text style = {{fontFamily: "abel", fontSize: 20,color:"white"}}>{item.username}</Text>
                  </TouchableOpacity>}
                />
                <RenderChosen formstate = {this.state.form}/>
              </View>:
              <ListyList groups = {this.state.passProps}navigation = {this.props.navigation}/>}
          </ScrollView>
        );
    };
}


const AlternativTo = () => {
  return (
  <Text></Text>
  );
}

const RenderChosen = (props) => {

        return (
          <FlatList style={{width: 310, marginTop: 5, marginBottom: 5}}
                  contentContainerStyle={{alignItems: "flex-start"}}
               
                  numColumns = {3}
                  data={props.formstate.members}
                  keyExtractor={({user_id}, index) => user_id.toString()}
                  renderItem={({item, index}) => 
                   <View style ={{backgroundColor: "orange", justifyContent: "center", padding: 5, margin: 6, borderRadius: 5}}>
                   <Text style = {{fontFamily: "abel", fontSize: 20, color: "white"}}>{item.username}</Text>
                   </View>}
          />
         
      
        );
      }

const styles = StyleSheet.create({
  masterview:{
    padding: 10,
    flex: 1,
  },
  newGroup: {

    backgroundColor: "#efefef",
    borderRadius: 10,
    height: 100,
    flex: -1,
    flexDirection: "row",
    justifyContent:'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  button: {
    height: 67,
    borderRadius: 50,
    width: 67,
    backgroundColor: "#FFB03C",
  },

  gruppetext: {
    fontFamily:"poetsenone",
    fontSize:30,
  },
  modalWind: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    margin: 5,
    backgroundColor: "#ececec",
  },
   textinput: {
    color: "orange",
    fontSize: 27,
    textAlign: 'left',
    fontFamily:"abel",
    borderRadius: 5,
    width: 194,
    backgroundColor: "white",
    paddingLeft: 5
   
  },
  inputRow: {
    flex:1,
    marginTop: 10,
    justifyContent:"center",
    alignItems: "center",

  },
  medlemRow: {
    flex:1,
    flexDirection:"row",
    justifyContent:"center",
    alignItems: "center",
    marginTop: 10,


  },

  resultrow: {
    top: 5,
    right: 58,
    width: 190,
    borderRadius: 5,
    backgroundColor: "white",
    opacity: 0.7,
  },
  user: {
    width: 180,
    margin: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#b9b9b9",
    borderRadius: 5,

  },
  registrer: {
    backgroundColor: "#FFB03C",
    borderRadius: 5,
    padding: 8,
    marginLeft: 10,

  },
  X: {
    left: 135,
    bottom: 20,
    fontSize: 40,
    shadowColor: "black",
    textShadowOffset: {width: 1,height: 1},
    zIndex: 3,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: 50,
    fontFamily: "PoorStory",
    width: 55,
    color: "#FFB03C"
  },
});
  

  
