import React from 'react';
import { Animated, Text, View } from 'react-native';

export default class FadeInView extends React.Component {
 state = {
    fadeAnim: new Animated.Value(0.1),  // Initial value for opacity: 0
  }

componentDidMount() {
  this.rundAnim()
}

  rundAnim() {
    Animated.loop(
  Animated.sequence([
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 1000,
    }),
    Animated.timing(this.state.fadeAnim, {
      toValue: 0.1,
      duration: 1000
    })
  ]),
    {
      iterations: 1
    }
  ).start(() => this.rundAnim())
}


  render() {
    let { fadeAnim } = this.state;

  
    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
        }}
      >
        <Animated.Image source={require('../assets/images/barcode2.png')} style={{resizeMode: 'contain', width: 300}}/>
        
        {this.props.children}
      </Animated.View>
    );
  }
}