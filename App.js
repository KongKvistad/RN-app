import React from "react";
import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation";
import { Text} from 'react-native';
import { Font, registerRootComponent } from 'expo';
import {AppLoading } from 'expo';

import HomeScreen from "./screens/HomeScreen";
import ListScreen from "./screens/ListScreen";


const AppNavigator = createMaterialTopTabNavigator(
  {
    Home: HomeScreen,
    list: ListScreen,
  },
  {
    initialRouteName: "Home"
  },
);
const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }
  async componentWillMount() {
    try {
      await Font.loadAsync({
        poetsenone: require('./assets/fonts/poetsenone.ttf'),
        PoorStory: require('./assets/fonts/PoorStory.ttf')
      });
      this.setState({ loading: false });
    } catch (error) {
      console.log('errorloading fonts', error);
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <AppLoading
        onFinish={() => this.setState({ loading: false })}
        onError={console.warn}
      />
      );
    }
    return (<AppContainer />);
  }
}

registerRootComponent(App);