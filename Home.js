import React, {Component} from 'react';
import { AppRegistry, StyleSheet, Text, Button, ListView, ScrollView, View, DeviceEventEmitter, TouchableOpacity} from 'react-native';
import Beacons from 'react-native-beacons-manager';
import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';

// components
import TabBarAnimation from './TabBarAnimation.js'

class Home extends Component {

   constructor(props) {
     super(props);

     var ds = new ListView.DataSource({
       rowHasChanged: (r1, r2) => r1 !== r2 }
     );
     this.state = {
       btnTitle: 'scan',
       headLine: 'tap to scan',
       uuidRef: '8492E75F-4FD6-469D-B132-043FE94921D8',
       dataSource: ds.cloneWithRows([])
     };

     this.scanBeacon = this.scanBeacon.bind(this);
     this.stopScanBeacon = this.stopScanBeacon.bind(this);
   }

   componentWillMount() {


   }

   scanBeacon(){
          Beacons.detectIBeacons();

            const uuid = this.state.uuidRef;
            Beacons
              .startRangingBeaconsInRegion(
                {identifier : 'REGION1',
                uuid: uuid}
              )
              .then(
                () => this.setState({headLine: 'Beacons ranging started succesfully'})
              )
              .catch(
                error => console.log(`Beacons ranging not started, error: ${error}`)
              );

        this.beaconsDidRange = DeviceEventEmitter.addListener(
               'beaconsDidRange',
               (data) => {

                 this.setState({
                   headLine: 'All beacons in the area',
                   btnTitle: 'stop',
                   dataSource: this.state.dataSource.cloneWithRows(data.beacons)
                 });
               }
             );
   }

   stopScanBeacon(){
        const uuid = this.state.uuidRef;

        this.setState({
           btnTitle: 'scan',
           headLine: 'tap to scan',
         });

         Beacons.stopRangingBeaconsInRegion({identifier : 'REGION1',
                                                         uuid: uuid})
   }

   render() {
     const { dataSource, btnTitle, headLine } =  this.state;
     let btnColor = btnTitle === 'scan'? '#00adc1':'#db7862'

     return (
       <View style={styles.container}>

           <ScrollableTabView
              initialPage={1}
              renderTabBar={() => <TabBarAnimation />}
            >
              <ScrollView tabLabel="menu" style={styles.tabView}>
                <Text>menu</Text>
              </ScrollView>
              <ScrollView tabLabel="access-point" style={styles.tabView}>
                <View style={{flex: .40, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity onPress={btnTitle === 'scan' ? ()=> this.scanBeacon() : ()=> this.stopScanBeacon()}>
                        <View style={[styles.circleBtn,{backgroundColor: btnColor}]}>
                            <Text style={{fontSize: 30, color: 'white'}}>{btnTitle}</Text>
                        </View>
                    </TouchableOpacity>
                     <Text style={styles.headline}>
                       { headLine }
                     </Text>
                     <ListView
                       dataSource={ dataSource }
                       enableEmptySections={ true }
                       renderRow={this.renderRow}
                     />
                </View>
              </ScrollView>
              <ScrollView tabLabel="bell-outline" style={styles.tabView}>
                <Text>Notifications</Text>
              </ScrollView>
           </ScrollableTabView>
       </View>
     );
   }

   renderRow = rowData => {
     return (
       <View style={styles.row}>
         <Text style={styles.smallText}>
           UUID: {rowData.uuid ? rowData.uuid  : 'NA'}
         </Text>
         <Text style={styles.smallText}>
           Major: {rowData.major ? rowData.major : 'NA'}
         </Text>
         <Text style={styles.smallText}>
           Minor: {rowData.minor ? rowData.minor : 'NA'}
         </Text>
         <Text>
           RSSI: {rowData.rssi ? rowData.rssi : 'NA'}
         </Text>
         <Text>
           Proximity: {rowData.proximity ? rowData.proximity : 'NA'}
         </Text>
         <Text>
           Distance: {rowData.accuracy ? rowData.accuracy.toFixed(2) : 'NA'}m
         </Text>
       </View>
     );
   }
 }

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#F5FCFF'
   },
   btleConnectionStatus: {
     // fontSize: 20,
     paddingTop: 20
   },
   headline: {
     fontSize: 20,
     paddingTop: 20
   },
   row: {
     backgroundColor: '#c7d9db',
     borderRadius: 4,
     elevation: 4,
     padding: 8,
     paddingBottom: 16
   },
   smallText: {
     fontSize: 16
   },
   tabView: {
     flex: 1,
     padding: 5,
     backgroundColor: 'rgba(0,0,0,0.01)',
   },
   circleBtn: {
       width: 100,
       height: 100,
       borderRadius: 100/2,
       justifyContent: 'center',
       alignItems: 'center',
       borderColor: '#00adc1',
       elevation: 4
   }
 });

export default Home;
