export default class GroupModal extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
       isclicked: "red",
       numcols: null,
       data: [],
       total: 0,
    };
  
   }

   render() {
   	return (
   		<Modal isVisible={this.state.isModalVisible} animationIn={"bounceIn"} animationInTiming={1000} animationOut={"bounceOut"}>
	        <View style={styles.modalWind}>
	          <Text onPress={this._toggleModal}>X</Text>
	        </View>
        </Modal>
   	);
   }

}