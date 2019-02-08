import React, { Component } from "react";
import { Text, TouchableOpacity, View, FlatList, StyleSheet, Button } from "react-native";
import Modal from "react-native-modal";

export default class Modaltest extends Component {


  render() {
    return (
      <Modal isVisible={this.props.isModalVisible}>
          <View style={styles.modalWind}>
            <Text style= {styles.X} onPress={this._toggleModal}>X</Text>
            <Text style= {styles.heading}>Er dette ditt produkt?</Text>
            <FlatList
            data={this.props.dataSource}
            renderItem={({item}) => 
            <View>
              <Text style= {styles.text}>Navn: {item.name}</Text>
              <View style={{flex: 1, flexDirection: "row", justifyContent: 'center' }}>
                <Text style= {styles.text}>Pris: </Text>
                <TextInput style={styles.text} value={item.pris.toString()}></TextInput>
              </View>

              <Text style= {styles.ean}>EAN-kode: {item.serial}</Text>
            </View>}
            keyExtractor={({id}, index) => id}
            />
          </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalWind: {
    backgroundColor: "white",
    borderRadius: 25,
    padding: 15,
  },
  X: {
    fontSize: 30,
    textAlign: "right",
  },
  heading: {
    fontSize: 25,
    textAlign: "center",
    paddingBottom: 50,
  },
  text: {
    color: "orange",
    fontSize: 35,
    textAlign: 'center',
  },
  ean: {
    color: "orange",
    textAlign: "center",
    paddingTop: 10,
    fontSize: 12,
  }

  
  
});