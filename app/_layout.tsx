import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import * as Application from 'expo-application';
import * as Font from 'expo-font';
import Swiper from 'react-native-swiper'
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, TouchableOpacity, StatusBar as statusbar, Platform } from "react-native";
import moment from 'moment';
import { scale } from 'react-native-size-matters';
import UserSession from "./UserSession";
import Index from "./index";
import Spending from "./spending";
import Setup from "./setup";

SplashScreen.preventAutoHideAsync()

export default function Layout() {

  var [appIsReady, setAppStatus] = useState(false)
  var deviceId: any = ''

  async function load() {
    if (Platform.OS === 'ios') {
      deviceId = await Application.getIosIdForVendorAsync();
    } 
    if (Platform.OS === 'android') {
      deviceId = await Application.getAndroidId();
    }
    console.log('device ID :', deviceId) // Mine: 6d40f748dd1d8bbe   Caro: 12138508123cda2f
    console.log('moment:', moment().format('YYYY-'))
    UserSession().setUserId(deviceId)

    await Font.loadAsync({
      Poppins_Light: require('../assets/fonts/Poppins-Light.ttf'),
      Poppins_Medium: require('../assets/fonts/Poppins-Medium.ttf'),
      Poppins_Regular: require('../assets/fonts/Poppins-Regular.ttf'),
      Segoe_Ui_Symbol: require('../assets/fonts/segoe-ui-symbol.ttf'),
    });
    console.log('App is ready~')
    setAppStatus(true)
    SplashScreen.hideAsync()
  }
  load()

  var [page, setPage] = useState(0)
  function screenChange(index: number){
    setPage(index)
  }

  var [fadeOpacity, setFadeOpacity] = useState('rgb(255, 255, 255)')
  function fading(x: number) {
    setFadeOpacity('rgb(' + (255-x/440.67*255).toString() + ',' + (255-x/440.67*255).toString() + ','  + (255-x/440.67*255).toString() + ')')
  }
  function getFadeValue() {
    return Number(fadeOpacity.substr(4, 3))
  }

  if (appIsReady) {
    return (
      <>
        <StatusBar style={getFadeValue() < 127.5 ? 'dark' : 'light'} translucent={true} backgroundColor="transparent"/>
        <Swiper
          horizontal={true}
          loop={false}
          showsPagination={false}
          index={0} 
          onIndexChanged={(index) => screenChange(index)}
          onScroll={(e) => fading(scale(e.nativeEvent.contentOffset.x))}>
          <View style={{flex: 1}}>
            <Index/>
          </View>
          <View style={{flex: 1}}>
            <Spending/>
          </View>
          <View style={{flex: 1}}>
            <Setup/>
          </View>
        </Swiper> 

        <View style={{position: 'absolute', marginTop: statusbar.currentHeight, alignSelf: 'center'}}>
            <Text style={{fontFamily: 'Poppins_Light', color: fadeOpacity, fontSize: scale(25), letterSpacing: scale(1)}}>Equivalent</Text>
        </View>

        <View style={{position: 'absolute', marginTop: statusbar.currentHeight, alignSelf: 'flex-end'}}>
          <TouchableOpacity style={{right: scale(17), top: scale(6)}}>
            <Image source={require('../assets/images/more.png')} style={{tintColor: fadeOpacity, height: scale(25), width: scale(25)}}></Image>
          </TouchableOpacity>
        </View>

        <View style={{position: 'absolute', flexDirection: 'row', bottom: scale(20), alignSelf: 'center'}}>
          <Image source={require('../assets/images/dot.png')} style={{tintColor: page == 0 ? 'white' : '#747474', height: scale(10), width: scale(10)}}></Image>
          <Image source={require('../assets/images/dot.png')} style={{tintColor: page == 1 ? 'white' : '#747474', height: scale(10), width: scale(10)}}></Image>
          <Image source={require('../assets/images/dot.png')} style={{tintColor: page == 2 ? 'white' : '#747474', height: scale(10), width: scale(10)}}></Image>
          <Image source={require('../assets/images/dot.png')} style={{tintColor: page == 3 ? 'white' : '#747474', height: scale(10), width: scale(10)}}></Image>
        </View>
      </>
    );
  }
}