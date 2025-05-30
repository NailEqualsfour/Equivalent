import { StatusBar, Text, StyleSheet, Image, Platform, ImageBackground, View, SafeAreaView, ScrollView, Modal, TouchableOpacity, FlatList } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
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

  var renderItem = ({item, index} : {item: any, index: number}) => {
    if (historyData[index + 1] != undefined) {
      if (item.time.substr(0, 7) != historyData[index + 1].time.substr(0, 7)) {
        return ( //what the fuck is this again?
          <>
          <TouchableOpacity key={index} activeOpacity={1} style={{flexDirection: 'row', marginLeft: scale(25), marginRight: scale(32), marginVertical: verticalScale(8)}}>
          <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: scale(17), width: scale(17), alignSelf: 'center', marginRight: scale(13), marginBottom: verticalScale(5)}}></Image>
          <View style={{flexDirection: 'column', flex: 1}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', height: verticalScale(25)}}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Nunito_Regular', color: 'black', opacity: item.name == '' ? 0.35 : 1, fontSize: scale(17), width: scale(160)}}>{item.name == '' ? '???' : item.name}</Text>
              <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: scale(17)}}>{displayCost(item.cost)}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', opacity: 0.6}}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(17), width: scale(130)}}>{item.category}</Text>
              <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(13.5), marginTop: verticalScale(3)}}>{displayDate(item.time)}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: scale(275), marginTop: verticalScale(20)}}>
            <Text style={{fontFamily: 'Poppins_Light', color: 'black', opacity: 0.6, fontSize: scale(20)}}>{moment(historyData[index + 1].time, 'YYYY-MM-DD-HH:mm:ss').format('MMMM YYYY')}</Text>
            <View style={{height: scale(1), flex: 1, marginLeft: scale(15), borderRadius: scale(0.5), backgroundColor: 'black', opacity: 0.2, alignSelf:'center', marginBottom: scale(6)}}></View>
          </View>
        </>
        )
      }
    }
    
    return (
      <TouchableOpacity key={index} activeOpacity={1} style={{flexDirection: 'row', marginLeft: scale(25), marginRight: scale(32), marginVertical: verticalScale(8)}}>
        <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: scale(17), width: scale(17), alignSelf: 'center', marginRight: scale(13), marginBottom: verticalScale(5)}}></Image>
        <View style={{flexDirection: 'column', flex: 1}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', height: verticalScale(25)}}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Nunito_Regular', color: 'black', opacity: item.name == '' ? 0.35 : 1, fontSize: scale(17), width: scale(160)}}>{item.name == '' ? '???' : item.name}</Text>
            <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: scale(17)}}>{displayCost(item.cost)}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', opacity: 0.6}}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(17), width: scale(130)}}>{item.category}</Text>
            <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(13.5), marginTop: verticalScale(3)}}>{displayDate(item.time)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  var [activePeriod, setPeriod] = useState(moment(historyData[0].time, 'YYYY-MM-DD-HH:mm:ss').format('MMMM YYYY'))
  function changePeriod(period: string) {
    setPeriod(moment(period, 'YYYY-MM-DD-HH:mm:ss').format('MMMM YYYY'))
  }

  return (
    <View style={{ backgroundColor: '#E4E4E4', flex: 1 }}>
      <View style={{position: 'absolute', marginTop: StatusBar.currentHeight}}>
        <TouchableOpacity onPress={() => console.log('ouch')} style={{left: scale(25), top: verticalScale(6)}}>
          <Image source={require('../assets/images/calendar.png')} style={{opacity: 0, height: scale(25), width: scale(25)}}></Image>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: verticalScale(85), flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: scale(275)}}>
        <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(20)}}>{activePeriod}</Text>
        <View style={{height: verticalScale(1.5), flex: 1, marginLeft: scale(15), borderRadius: verticalScale(0.75), backgroundColor: 'black', alignSelf:'center', marginBottom: verticalScale(6)}}></View>
      </View>

      <FlatList fadingEdgeLength={verticalScale(40)} style={{marginBottom: verticalScale(40)}} 
        data={historyData}
        onViewableItemsChanged={(e) => (changePeriod(e.viewableItems[0].item.time))}
        renderItem={renderItem}/>
    </View>
  );
}
