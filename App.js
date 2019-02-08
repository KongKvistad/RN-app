import React from "react";
import { createMaterialTopTabNavigator, createAppContainer } from "react-navigation";
import { Font } from 'expo';

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
  componentDidMount() {
    Font.loadAsync({
      poetsenone: require('./assets/fonts/poetsenone.ttf'),
      PoorStory: require('./assets/fonts/PoorStory.ttf')
    });
  }

  render() {
    return (
      <AppContainer />
    );
  }
}

