import React, { useEffect, useState } from "react";
import * as SplashScreen from 'expo-splash-screen';
import * as Application from 'expo-application';
import * as Font from 'expo-font';
import Swiper from 'react-native-swiper'
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, TouchableOpacity, StatusBar as statusbar, Platform, ImageBackground } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import moment from 'moment';
import { scale, verticalScale } from 'react-native-size-matters';
import UserSession from "./UserSession";
import Index from "./index";
import Spending from "./spending";
import History from "./history";
import Setup from "./setup";
import SupabaseService from "./SupabaseService";

SplashScreen.preventAutoHideAsync()

export default function Layout() {

  var [appIsReady, setAppStatus] = useState(false)
  var database = SupabaseService()
  var deviceId: any = ''

  useEffect(() => {
    load()
  }, [])

  async function load() {
    if (Platform.OS === 'ios') {
      deviceId = await Application.getIosIdForVendorAsync();
    } 
    if (Platform.OS === 'android') {
      deviceId = await Application.getAndroidId();
    }

    // console.log('device ID :', deviceId) // Mine: 6d40f748dd1d8bbe   Caro: 12138508123cda2f
    console.log(deviceId)
    var user = await database.getUserBySerial('12138508123cda2f')
    if (!user) {
      await database.createUser(deviceId) 
      user = await database.getUserBySerial(deviceId)
      await database.createSettings(user.id) 
      await database.createBudget({userId: user.id, budget: 100, time: moment().format('YYYY-MM')})
      await database.createCategory({userId: user.id, name: 'Food', color: '#3CC560'})
      await database.createCategory({userId: user.id, name: 'Transport', color: '#06D3E2'})
      await database.createCategory({userId: user.id, name: 'Miscellaneous', color: '#EC4EA4'})
    }
    UserSession().setUserId(user.id) 

    await Font.loadAsync({
      Poppins_Light: require('../assets/fonts/Poppins-Light.ttf'),
      Poppins_Medium: require('../assets/fonts/Poppins-Medium.ttf'),
      Poppins_Regular: require('../assets/fonts/Poppins-Regular.ttf'),
      Segoe_Ui_Symbol: require('../assets/fonts/segoe-ui-symbol.ttf'),
      Nunito_Regular: require('../assets/fonts/Nunito-Regular.ttf'),
      Fira_Code_Regular: require('../assets/fonts/FiraCode-Regular.ttf'),
    });
    console.log('App Status: Ready')
    setAppStatus(true)
    SplashScreen.hideAsync()
  }

  var [page, setPage] = useState(0)
  function screenChange(index: number){
    setPage(index)
  }

  var [fadeTint, setFadeTint] = useState('rgb(255, 255, 255)')
  var [fadeOpacity, setFadeOpacity] = useState(0)
  function fading(x: number) {
    setFadeTint('rgb(' + (255-x/440.67*255).toString() + ',' + (255-x/440.67*255).toString() + ','  + (255-x/440.67*255).toString() + ')')
    if (x < 881.34){
      setFadeOpacity((x-550.84)/330.5)
    }
    else{
      setFadeOpacity((1211.54-x)/330.2)
    }
  }
  function getFadeValue() {
    return Number(fadeTint.substr(4, 3))
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
            <Index isFocused={page === 0}/>
          </View>
          <View style={{flex: 1}}>
            <Spending isFocused={page === 1}/>
          </View>
          <View style={{flex: 1}}>
            <History isFocused={page === 2}/>
          </View>
          <View style={{flex: 1}}>
            <Setup isFocused={page === 3}/>
          </View>
        </Swiper> 

        <Animated.View style={{position: 'absolute', marginTop: statusbar.currentHeight, left: scale(25), top: verticalScale(4.5), pointerEvents: 'none'}}>
          <Image source={require('../assets/images/calendar.png')} style={{opacity: fadeOpacity, height: scale(25), width: scale(25)}}></Image>
        </Animated.View>

        <View style={{position: 'absolute', marginTop: statusbar.currentHeight, alignSelf: 'center'}}>
            <Text style={{fontFamily: 'Poppins_Light', color: fadeTint, fontSize: scale(25), letterSpacing: scale(1)}}>Equivalent</Text>
        </View>

        <View style={{position: 'absolute', marginTop: statusbar.currentHeight, alignSelf: 'flex-end'}}>
          <TouchableOpacity style={{right: scale(17), top: verticalScale(4.5)}}>
            <Image source={require('../assets/images/settings.png')} style={{tintColor: fadeTint, height: scale(25), width: scale(25)}}></Image>
          </TouchableOpacity>
        </View>

        <View style={{position: 'absolute', flexDirection: 'row', bottom: verticalScale(19.5), alignSelf: 'center'}}>
          <Image source={require('../assets/images/dot.png')} style={{tintColor: page == 0 ? 'white' : '#747474', height: scale(10), width: scale(10)}}></Image>
          <Image source={require('../assets/images/dot.png')} style={{tintColor: page == 1 ? 'white' : '#747474', height: scale(10), width: scale(10)}}></Image>
          <Image source={require('../assets/images/dot.png')} style={{tintColor: page == 2 ? 'white' : '#747474', height: scale(10), width: scale(10)}}></Image>
          <Image source={require('../assets/images/dot.png')} style={{tintColor: page == 3 ? 'white' : '#747474', height: scale(10), width: scale(10)}}></Image>
        </View>
      </>
    );
  }
}