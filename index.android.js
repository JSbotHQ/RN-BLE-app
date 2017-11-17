import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';

// components
import Home from './Home.js'

class AppClass extends Component {

   render() {
     return (<Home/>);
   }
 }

 AppRegistry.registerComponent(
   'reactNativeBeaconExample',
   () => AppClass
 );
