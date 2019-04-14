import React from "react";
import { createMaterialTopTabNavigator, createAppContainer,createStackNavigator, createSwitchNavigator } from "react-navigation";
import { Text} from 'react-native';
import { Font, registerRootComponent } from 'expo';
import {AppLoading } from 'expo';

import HomeScreen from "./screens/HomeScreen";
import ListScreen from "./screens/ListScreen";
import GroupScreen from "./screens/GroupScreen";
import SignInScreen from "./screens/signin";
import RegScreen from  "./screens/RegScreen"


const ListStack = createStackNavigator({ list: ListScreen});
const AuthStack = createStackNavigator(
  { 
    SignIn: SignInScreen,
    RegUser: RegScreen,
  }
);
const AppNavigator = createMaterialTopTabNavigator(
  {
    Home: HomeScreen,
    Groups: GroupScreen,
   
  },
  {
    initialRouteName: "Home"
  },
);
const AppContainer = createAppContainer(createSwitchNavigator(
  {
    Auth: AuthStack,
    App: AppNavigator,
    List: ListStack,
  },
  {
    initialRouteName: "Auth"
  },
));

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      loading: true,
      selectedGroup: null,
    };
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