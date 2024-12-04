import { StatusBar, Text, StyleSheet, Image, Platform, ImageBackground, View, SafeAreaView, ScrollView, Modal, TouchableOpacity, FlatList } from 'react-native';
import { scale } from 'react-native-size-matters';
import { useState } from 'react';
import UserSession from "./UserSession";
import DatabaseService from './DatabaseService'
import moment from 'moment';

export default function History() {
  var userId = UserSession().getUserId()
  var database = DatabaseService()

  var [historyData, setHistoryData] = useState(database.getTransactionByUserId(userId!))
  function refreshData() {
    console.log('Data refreshed??')
    setHistoryData(database.getTransactionByUserId(userId!))
  }

  function displayCost(value: number) {
    return '-S$' + value.toFixed(2).toLocaleString()
  }
  function displayDate(time: string) {
    return moment(time, 'YYYY-MM-DD-HH:mm:ss').format('D MMMM YYYY')
  }

  return (
    <View style={{ backgroundColor: '#E4E4E4', flex: 1 }}>
      <View style={{position: 'absolute', marginTop: StatusBar.currentHeight}}>
        <TouchableOpacity onPress={() => console.log('ww')} style={{left: scale(25), top: scale(6)}}>
          <Image source={require('../assets/images/calendar.png')} style={{opacity: 0, height: scale(25), width: scale(25)}}></Image>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: scale(90), flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: scale(275)}}>
        <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(20)}}>February 2024</Text>
        <View style={{height: scale(1.5), flex: 1, marginLeft: scale(15), borderRadius: scale(0.75), backgroundColor: 'black', alignSelf:'center', marginBottom: scale(6)}}></View>
      </View>

      <FlatList fadingEdgeLength={scale(40)} style={{marginBottom: scale(40)}} 
        data={historyData}
        renderItem={({ index, item}) => 
        item.time.substr(0, 7) == (index != 0 ? historyData[index-1].time.substr(0,7) : 'different') ? 
          <TouchableOpacity key={index} activeOpacity={1} style={{flexDirection: 'row', marginLeft: scale(25), marginRight: scale(32), marginVertical: scale(8)}}>
            <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: scale(17), width: scale(17), alignSelf: 'center', marginRight: scale(13), marginBottom: scale(5)}}></Image>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', height: scale(25)}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Nunito_Regular', color: 'black', opacity: item.name == '' ? 0.35 : 1, fontSize: scale(17), width: scale(160)}}>{item.name == '' ? '???' : item.name}</Text>
                <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: scale(17)}}>{displayCost(item.cost)}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', opacity: 0.6}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(17), width: scale(130)}}>{item.category}</Text>
                <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(13.5), marginTop: scale(3.5)}}>{displayDate(item.time)}</Text>
              </View>
            </View>
          </TouchableOpacity>
          :
          <>
          <View style={{flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: scale(275), marginTop: scale(20)}}>
            <Text style={{fontFamily: 'Poppins_Light', color: 'black', opacity: 0.6, fontSize: scale(20)}}>{moment(item.time, 'YYYY-MM-DD-HH:mm:ss').format('MMMM YYYY')}</Text>
            <View style={{height: scale(1.5), flex: 1, marginLeft: scale(15), borderRadius: scale(0.75), backgroundColor: 'black', opacity: 0.3, alignSelf:'center', marginBottom: scale(6)}}></View>
          </View>
          <TouchableOpacity key={index} activeOpacity={1} style={{flexDirection: 'row', marginLeft: scale(25), marginRight: scale(32), marginVertical: scale(8)}}>
            <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: scale(17), width: scale(17), alignSelf: 'center', marginRight: scale(13), marginBottom: scale(5)}}></Image>
            <View style={{flexDirection: 'column', flex: 1}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', height: scale(25)}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Nunito_Regular', color: 'black', opacity: item.name == '' ? 0.35 : 1, fontSize: scale(17), width: scale(160)}}>{item.name == '' ? '???' : item.name}</Text>
                <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: scale(17)}}>{displayCost(item.cost)}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', opacity: 0.6}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(17), width: scale(130)}}>{item.category}</Text>
                <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(13.5), marginTop: scale(3.5)}}>{displayDate(item.time)}</Text>
              </View>
            </View>
          </TouchableOpacity>
          </>
        }
      />
    </View>
  );
}
