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

  var [selectedIndex, setSelectedIndex] = useState(-1)
  var [selectedName, setSelectedName] = useState('')
  var [selectedExpense, setSelectedExpense] = useState(0)
  var [selectedCategory, setSelectedCategory] = useState('')
  var [selectedDate, setSelectedDate] = useState('')
  function select(index: number, name: string, expense: number, category: string, date: string){
    if (index == selectedIndex) {
      setSelectedIndex(-1)
    }
    else {
      setSelectedIndex(index)
      setSelectedName(name)
      setSelectedExpense(expense)
      setSelectedCategory(category)
      setSelectedDate(date)
    }
  }
  var [deletePopUpVisibility, setDeletePopUpVisibility] = useState(false)
  function toggleDeletePopUpVisibility() {
    setDeletePopUpVisibility(!deletePopUpVisibility)
  }

  var renderItem = ({item, index} : {item: any, index: number}) => {
    if (historyData[index + 1] != undefined) {
      if (item.time.substr(0, 7) != historyData[index + 1].time.substr(0, 7)) {
        return (
          <>
          <TouchableOpacity onPress={() => select(index, item.name, item.cost, item.category, item.time)} key={index} activeOpacity={1} style={{flexDirection: 'row', marginLeft: scale(25), marginRight: scale(32), marginVertical: verticalScale(8)}}>
            {
              selectedIndex == index ? 
              <View style={{flexDirection: 'column', marginLeft: -scale(4), marginRight: scale(12)}}>
                <TouchableOpacity style={{alignSelf: 'center', borderWidth: scale(1.5), borderRadius: scale(5), borderColor: database.getCategoryColor(userId!, item.category), marginTop: verticalScale(2)}}>
                  <Image source={require('../assets/images/edit.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: scale(19), width: scale(19)}}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleDeletePopUpVisibility} style={{alignSelf: 'center', borderWidth: scale(1.5), borderRadius: scale(5), borderColor: database.getCategoryColor(userId!, item.category), marginTop: verticalScale(4)}}>
                  <Image source={require('../assets/images/delete.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: scale(19), width: scale(19)}}></Image>
                </TouchableOpacity>
              </View>
              :
              <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: scale(17), width: scale(17), alignSelf: 'center', marginRight: scale(13), marginBottom: verticalScale(5)}}></Image>
            }
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
      <TouchableOpacity onPress={() => select(index, item.name, item.cost, item.category, item.time)} key={index} activeOpacity={1} style={{flexDirection: 'row', marginLeft: scale(25), marginRight: scale(32), marginVertical: verticalScale(8)}}>
        {
          selectedIndex == index ? 
          <View style={{flexDirection: 'column', marginLeft: -scale(4), marginRight: scale(12)}}>
            <TouchableOpacity style={{alignSelf: 'center', borderWidth: scale(1.5), borderRadius: scale(5), borderColor: database.getCategoryColor(userId!, item.category), marginTop: verticalScale(2)}}>
              <Image source={require('../assets/images/edit.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: scale(19), width: scale(19)}}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDeletePopUpVisibility} style={{alignSelf: 'center', borderWidth: scale(1.5), borderRadius: scale(5), borderColor: database.getCategoryColor(userId!, item.category), marginTop: verticalScale(4)}}>
              <Image source={require('../assets/images/delete.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: scale(19), width: scale(19)}}></Image>
            </TouchableOpacity>
          </View>
          :
          <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: scale(17), width: scale(17), alignSelf: 'center', marginRight: scale(13), marginBottom: verticalScale(5)}}></Image>
        }
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
    <>
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

      <View>
        <Modal visible={deletePopUpVisibility} transparent={true} statusBarTranslucent>
          <TouchableOpacity activeOpacity={1} style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../assets/images/venti_chibi_shookth.png')} style={{height: verticalScale(220), width: verticalScale(220), zIndex: 1, marginLeft: scale(20), marginTop: -verticalScale(180)}}></Image>
            <View style={{backgroundColor: '#E4E4E4', height: verticalScale(185), marginHorizontal: scale(17), paddingTop: verticalScale(25), marginTop: -verticalScale(30), borderRadius: scale(25), alignSelf: 'stretch'}}>
              <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(18), textAlign: 'center'}}>Are you sure you want{selectedIndex}{'\n'}to delete this transaction?</Text>

              <View style={{flexDirection: 'row', marginLeft: scale(8), marginRight: scale(16), marginVertical: verticalScale(15)}}>
                <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, selectedCategory), height: scale(17), width: scale(17), alignSelf: 'center', marginRight: scale(13), marginBottom: verticalScale(5)}}></Image>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', height: verticalScale(25)}}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Nunito_Regular', color: 'black', opacity: selectedName == '' ? 0.35 : 1, fontSize: scale(17), width: scale(160)}}>{selectedName == '' ? '???' : selectedName}</Text>
                    <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: scale(17)}}>{displayCost(selectedExpense)}</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', opacity: 0.6}}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(17), width: scale(130)}}>{selectedCategory}</Text>
                    <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(13.5), marginTop: verticalScale(3)}}>{displayDate(selectedDate)}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: -verticalScale(20)}}>
             <View>
              <View style={{backgroundColor: '#A8A8A8', height: verticalScale(40), width: scale(105), borderRadius: scale(10), position: 'absolute', bottom: verticalScale(2.5)}}></View>
              <TouchableOpacity onPress={toggleDeletePopUpVisibility} style={{backgroundColor: '#E4E4E4', height: verticalScale(40), width: scale(105), justifyContent: 'center', borderRadius: scale(10), left: scale(2.5), marginRight: scale(40)}}>
                <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(18), textAlign: 'center'}}>Cancel</Text>
              </TouchableOpacity>
             </View>
             <View>
              <View style={{backgroundColor: '#681E1E', height: verticalScale(40), width: scale(105), borderRadius: scale(10), position: 'absolute', bottom: verticalScale(2.5)}}></View>
              <TouchableOpacity style={{backgroundColor: '#C53C3C', height: verticalScale(40), width: scale(105), justifyContent: 'center', borderRadius: scale(10), left: scale(2.5)}}>
                <Text style={{fontFamily: 'Poppins_Regular', color: '#E4E4E4', fontSize: verticalScale(18), textAlign: 'center'}}>Delete</Text>
              </TouchableOpacity>
             </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
}
