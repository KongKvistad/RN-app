// "node api.js" from root folder to start mysqlserver
// "npm start" from root to start expo project

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
    dataSource: null,
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    if (this.state.dataSource === null){
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner style={StyleSheet.absoluteFill}
          onBarCodeScanned={this.handleBarCodeScanned}
        />
      </View>
    );
    } else if (this.state.dataSource !== null) {
      return (
      <View style={{alignItems: 'center'}}>
          <Popup status={this.state.dataSource} />
      </View>
      );
    }
  } 

  

  handleBarCodeScanned = ({ type, data }) => {
    //ip, hjemme http://10.0.0.102:3000/products/:1
    //ip, biblo http://10.80.88.236:3000/products/:1
    return fetch('http://10.22.204.78:3000/products/' + data)
      .then((response) => response.json())
      .then((responseJson) => {

        let serial = responseJson[0].serial;

        if (data === JSON.stringify(serial)) {
          this.setState({
            dataSource: JSON.stringify(responseJson[0]),
          })

        }else {
          alert(`the data is: ${serial}`);
        };

        

      })
      .catch((error) =>{
        console.error(error);
      });
  }
}


class Popup extends React.Component {
  render() {
    return (
      <View style={{alignItems: 'center'}}>
        <Text>{this.props.status}</Text>
      </View>
    );
  }
}

// import React from 'react';
// import { Stylesheet, FlatList, ActivityIndicator, Text, View  } from 'react-native';
// import { BarCodeScanner, Permissions } from 'expo';

// export default class FetchExample extends React.Component {

//   constructor(props){
//     super(props);
//     this.state ={ isLoading: true}
//   }

//   componentDidMount(){
//     return fetch('http://10.0.0.102:3000/user/:1')
//       .then((response) => response.json())
//       .then((responseJson) => {

//         this.setState({
//           isLoading: false,
//           dataSource: responseJson,
//         }, function(){

//         });

//       })
//       .catch((error) =>{
//         console.error(error);
//       });
//   }



//   render(){

//     if(this.state.isLoading){
//       return(
//         <View style={{flex: 1, padding: 20}}>
//           <ActivityIndicator/>
//         </View>
//       )
//     }

//     return(
//       <View style={{flex: 1}}>
//         <FlatList
//           data={this.state.dataSource}
//           renderItem={({item}) => <Text>{item.type}, {item.serial}</Text>}
//           keyExtractor={({id}, index) => id}/>
//         <View style={{flex: 1}}>
//           <Text>lol</Text>
//         </View>
//       </View>
//     );
//   }
// }