import { StatusBar, Text, StyleSheet, Image, Platform, ImageBackground, View, SafeAreaView, ScrollView, Modal, TouchableOpacity, FlatList, Animated, TextInput } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import React, { useRef, useState } from 'react';
import UserSession from "./UserSession";
import DatabaseService from './DatabaseService'
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  var [selectedExpense, setSelectedExpense] = useState('')
  var [selectedCategory, setSelectedCategory] = useState('')
  var [selectedDate, setSelectedDate] = useState('')
  function setSelectedValue(index: number, name: string, expense: number, category: string, date: string) {
    setSelectedIndex(index)
    setSelectedName(name)
    setSelectedExpense(expense.toString())
    setSelectedCategory(category)
    setSelectedDate(date)
  }
  function select(index: number, name: string, expense: number, category: string, date: string){
    if (index == selectedIndex) {
      setSelectedIndex(-1)
      slideHide(index)
    }
    else {
      if (selectedIndex != -1) {slideHide(selectedIndex)}
      setSelectedValue(index, name, expense, category, date)
      slideShow(index)
    }
  }
  var slideAnimation = React.useRef<Animated.Value[]>([]).current
  historyData.forEach((_, index) => {
    if (!slideAnimation[index]) {
      slideAnimation[index] = new Animated.Value(-scale(150));
    }
  });
  function slideShow(index: number) {
    Animated.spring(slideAnimation[index], {
      toValue: -scale(50),
      tension: 30,
      friction: 4,
      useNativeDriver: false
    }).start();
  }
  function slideHide(index: number) {
    Animated.spring(slideAnimation[index], {
      toValue: -scale(150),
      tension: 10,
      friction: 2,
      useNativeDriver: false
    }).start();
  }
  var [deletePopUpVisibility, setDeletePopUpVisibility] = useState(false)
  function toggleDeletePopUpVisibility() {
    setDeletePopUpVisibility(!deletePopUpVisibility)
  }
  var [editPopUpVisibility, setEditPopUpVisibility] = useState(false)
  function toggleEditPopUpVisibility() {
    setEditPopUpVisibility(!editPopUpVisibility)
  }
  var hiddenNameInput = useRef<TextInput>(null);
  var hiddenExpenseInput = useRef<TextInput>(null);
  function toggleKeyboard(text: string) {
    setCategoryDropdownVisibility(false)
    if (text == 'Name') {
      hiddenNameInput.current?.focus()
    }
    if (text == 'Expense') {
      hiddenExpenseInput.current?.focus()
    }
  }
  function typed(key: any, text: string) {
    key = key.nativeEvent.key
    console.log(key)
    if (text == 'Name') {
      if (key == 'Backspace'){
        setSelectedName(selectedName.slice(0, -1))
      }
      else {
        setSelectedName(selectedName + key)
      }
    }
    if (text == 'Expense') {
      if (key == 'Backspace') {
        setSelectedExpense(selectedExpense.substring(0, selectedExpense.length - 1))
      }
      else if (key == '.' && selectedExpense.length == 0) {
        setSelectedExpense('0.')
      }
      else if (key == '.' && selectedExpense.includes('.')) {
        setSelectedExpense(selectedExpense)
      }
      else if (key == '0' && selectedExpense.length == 0) {
        setSelectedExpense(selectedExpense)
      }
      else if (key != '.' && !selectedExpense.includes('.') && selectedExpense.length >= 4) {
        setSelectedExpense(selectedExpense)
      }
      else if (selectedExpense.includes('.') && selectedExpense.substr(selectedExpense.indexOf('.'), 3).length == 3) {
        setSelectedExpense(selectedExpense)
      }
      else if (key == '.' || key == '0' || key == '1' || key == '2' || key == '3' || key == '4' || key == '5' || key == '6' || key == '7' || key == '8' || key == '9') {
        setSelectedExpense(selectedExpense + key)
      }
    }
  }
  var categoryList = database.getUserCategories(userId!)
  var [categoryDropdownVisibility, setCategoryDropdownVisibility] = useState(false)
  var [datePickerVisibility, setDatePickerVisibility] = useState(false)
  function pickDate(date: Date) {
    setSelectedDate(moment(date).format('YYYY-MM-DD-HH:mm:ss'))
    setDatePickerVisibility(false)
  }

  var renderItem = ({item, index} : {item: any, index: number}) => {
    if (historyData[index + 1] != undefined) {
      if (item.time.substr(0, 7) != historyData[index + 1].time.substr(0, 7)) {
        return (
          <>
          <View style={{justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => select(index, item.name, item.cost, item.category, item.time)} key={index} activeOpacity={1} style={{flexDirection: 'row', marginLeft: scale(25), marginRight: scale(32), marginVertical: verticalScale(8)}}>
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
            <Animated.View style={{flexDirection: 'row', position: 'absolute', height: verticalScale(45), width: scale(150), borderTopLeftRadius: scale(50), borderBottomLeftRadius: scale(50), backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', right: slideAnimation[index]}}>
              <TouchableOpacity onPress={() => {setSelectedValue(index, item.name, item.cost, item.category, item.time); toggleEditPopUpVisibility();}} style={{borderColor: database.getCategoryColor(userId!, item.category), height: verticalScale(30), width: verticalScale(30), borderWidth: scale(2), borderRadius: scale(15), alignItems: 'center', justifyContent: 'center', margin: scale(7)}}>
                <Image source={require('../assets/images/edit.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: verticalScale(20), width: verticalScale(20)}}></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {setSelectedValue(index, item.name, item.cost, item.category, item.time); toggleDeletePopUpVisibility();}} style={{borderColor: database.getCategoryColor(userId!, item.category), height: verticalScale(30), width: verticalScale(30), borderWidth: scale(2), borderRadius: scale(15), alignItems: 'center', justifyContent: 'center', marginRight: scale(50)}}>
                <Image source={require('../assets/images/delete.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: verticalScale(20), width: verticalScale(20)}}></Image>
              </TouchableOpacity>
            </Animated.View>
          </View>
          <View style={{flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: scale(275), marginTop: verticalScale(20)}}>
            <Text style={{fontFamily: 'Poppins_Light', color: 'black', opacity: 0.6, fontSize: scale(20)}}>{moment(historyData[index + 1].time, 'YYYY-MM-DD-HH:mm:ss').format('MMMM YYYY')}</Text>
            <View style={{height: scale(1), flex: 1, marginLeft: scale(15), borderRadius: scale(0.5), backgroundColor: 'black', opacity: 0.2, alignSelf:'center', marginBottom: scale(6)}}></View>
          </View>
        </>
        )
      }
    }
    
    return (
      <View style={{justifyContent: 'center'}}>
        <TouchableOpacity onPress={() => select(index, item.name, item.cost, item.category, item.time)} key={index} activeOpacity={1} style={{flexDirection: 'row', marginLeft: scale(25), marginRight: scale(32), marginVertical: verticalScale(8)}}>
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
        <Animated.View style={{flexDirection: 'row', position: 'absolute', height: verticalScale(45), width: scale(150), borderTopLeftRadius: scale(50), borderBottomLeftRadius: scale(50), backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', right: slideAnimation[index]}}>
          <TouchableOpacity onPress={() => {setSelectedValue(index, item.name, item.cost, item.category, item.time); toggleEditPopUpVisibility();}} style={{borderColor: database.getCategoryColor(userId!, item.category), height: verticalScale(30), width: verticalScale(30), borderWidth: scale(2), borderRadius: scale(15), alignItems: 'center', justifyContent: 'center', margin: scale(7)}}>
            <Image source={require('../assets/images/edit.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: verticalScale(20), width: verticalScale(20)}}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setSelectedValue(index, item.name, item.cost, item.category, item.time); toggleDeletePopUpVisibility();}} style={{borderColor: database.getCategoryColor(userId!, item.category), height: verticalScale(30), width: verticalScale(30), borderWidth: scale(2), borderRadius: scale(15), alignItems: 'center', justifyContent: 'center', marginRight: scale(50)}}>
            <Image source={require('../assets/images/delete.png')} style={{tintColor: database.getCategoryColor(userId!, item.category), height: verticalScale(20), width: verticalScale(20)}}></Image>
          </TouchableOpacity>
        </Animated.View>
      </View>
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
              <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(18), textAlign: 'center'}}>Are you sure you want{'\n'}to delete this transaction?</Text>

              <View style={{flexDirection: 'row', marginLeft: scale(8), marginRight: scale(16), marginVertical: verticalScale(15)}}>
                <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, selectedCategory), height: scale(17), width: scale(17), alignSelf: 'center', marginRight: scale(13), marginBottom: verticalScale(5)}}></Image>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', height: verticalScale(25)}}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Nunito_Regular', color: 'black', opacity: selectedName == '' ? 0.35 : 1, fontSize: scale(17), width: scale(160)}}>{selectedName == '' ? '???' : selectedName}</Text>
                    <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: scale(17)}}>{displayCost(Number(selectedExpense))}</Text>
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

      <View style={{position: 'absolute'}}>
        <Modal visible={editPopUpVisibility} transparent={true} statusBarTranslucent>
          <TouchableOpacity onPress={() => setCategoryDropdownVisibility(false)} activeOpacity={1} style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../assets/images/venti_chibi_lightbulb.png')} style={{height: verticalScale(190), width: verticalScale(190), zIndex: 1, marginLeft: -scale(30), marginTop: -verticalScale(110)}}></Image>
            <View style={{backgroundColor: '#E4E4E4', height: verticalScale(345), marginHorizontal: scale(17), paddingTop: verticalScale(20), marginTop: -verticalScale(23), borderRadius: scale(25), alignSelf: 'stretch'}}>

              <View style={{flexDirection: 'row', marginLeft: scale(8), marginRight: scale(16)}}>
                <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, selectedCategory), height: scale(17), width: scale(17), alignSelf: 'center', marginRight: scale(13), marginBottom: verticalScale(5)}}></Image>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', height: verticalScale(25)}}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Nunito_Regular', color: 'black', opacity: selectedName == '' ? 0.35 : 1, fontSize: scale(17), width: scale(160)}}>{selectedName == '' ? '???' : selectedName}</Text>
                    <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: scale(17)}}>{displayCost(Number(selectedExpense))}</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', opacity: 0.6}}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(17), width: scale(130)}}>{selectedCategory}</Text>
                    <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(13.5), marginTop: verticalScale(3)}}>{displayDate(selectedDate)}</Text>
                  </View>
                </View>
              </View>

              <View style={{marginBottom: verticalScale(3)}}>
                <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(15), marginLeft: scale(28), marginBottom: -verticalScale(3)}}>Name</Text>
                <TouchableOpacity onPress={() => toggleKeyboard('Name')} style={{backgroundColor: '#EEEEEE', height: verticalScale(34), marginHorizontal: scale(25), borderRadius: verticalScale(10), borderWidth: scale(1), alignItems: 'center', justifyContent: 'center'}}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(16), marginBottom: -verticalScale(4)}}>{selectedName}</Text>
                </TouchableOpacity>
              </View>
              <View style={{marginBottom: verticalScale(3)}}>
                <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(15), marginLeft: scale(28), marginBottom: -verticalScale(3)}}>Expense</Text>
                <TouchableOpacity onPress={() => toggleKeyboard('Expense')} style={{backgroundColor: '#EEEEEE', height: verticalScale(34), marginHorizontal: scale(25), borderRadius: verticalScale(10), borderWidth: scale(1), alignItems: 'center', justifyContent: 'center'}}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(16), marginBottom: -verticalScale(4)}}>{selectedExpense == '' ? '' : '-S$'}{selectedExpense}</Text>
                </TouchableOpacity>
              </View>
              <View style={{marginBottom: verticalScale(3)}}>
                <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(15), marginLeft: scale(28), marginBottom: -verticalScale(3)}}>Category</Text>
                {!categoryDropdownVisibility ? 
                <TouchableOpacity onPress={() => setCategoryDropdownVisibility(true)} style={{backgroundColor: '#EEEEEE', height: verticalScale(34), marginHorizontal: scale(25), borderRadius: verticalScale(10), borderWidth: scale(1), alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, selectedCategory), height: scale(17), width: scale(17), position: 'absolute', alignSelf: 'flex-start', marginLeft: scale(9), marginBottom: verticalScale(5)}}></Image>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(16), marginBottom: -verticalScale(4)}}>{selectedCategory}</Text>
                  <Image source={require('../assets/images/arrow_down.png')} style={{height: scale(20), width: scale(20), position: 'absolute', alignSelf: 'flex-end', right: scale(9), marginBottom: verticalScale(5)}}></Image>
                </TouchableOpacity>
                :
                <>
                <TouchableOpacity onPress={() => setCategoryDropdownVisibility(false)} style={{backgroundColor: '#EEEEEE', height: verticalScale(34), marginHorizontal: scale(25), borderTopLeftRadius: verticalScale(10), borderTopRightRadius: verticalScale(10), borderWidth: scale(1), alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, selectedCategory), height: scale(17), width: scale(17), position: 'absolute', alignSelf: 'flex-start', marginLeft: scale(9), marginBottom: verticalScale(5)}}></Image>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(16), marginBottom: -verticalScale(4)}}>{selectedCategory}</Text>
                  <Image source={require('../assets/images/arrow_down.png')} style={{height: scale(20), width: scale(20), position: 'absolute', alignSelf: 'flex-end', right: scale(9), marginBottom: verticalScale(5)}}></Image>
                </TouchableOpacity>
                <ScrollView style={{backgroundColor: '#EEEEEE', left: scale(25), right: scale(25), zIndex: 1, position: 'absolute', top: verticalScale(56), maxHeight: verticalScale(197), borderBottomLeftRadius: verticalScale(13), borderBottomRightRadius: verticalScale(13)}}>
                  {categoryList.map((category, index) => {
                    if (category != selectedCategory) {
                      return (
                        <TouchableOpacity key={index} activeOpacity={0.4} onPress={() => {setSelectedCategory(category); setCategoryDropdownVisibility(false);}} style={{backgroundColor: '#EEEEEE', height: verticalScale(34), marginTop: -verticalScale(1), borderWidth: scale(1), alignItems: 'center', justifyContent: 'center'}}>
                          <Image source={require('../assets/images/dot.png')} style={{tintColor: database.getCategoryColor(userId!, category), height: scale(17), width: scale(17), position: 'absolute', alignSelf: 'flex-start', marginLeft: scale(9), marginBottom: verticalScale(5)}}></Image>
                          <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(16), marginBottom: -verticalScale(4)}}>{category}</Text>
                        </TouchableOpacity>
                      )
                    }  
                  })
                  }
                </ScrollView>
                </>
                }
              </View>
              <View style={{marginBottom: verticalScale(3)}}>
                <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(15), marginLeft: scale(28), marginBottom: -verticalScale(3)}}>Date</Text>
                <TouchableOpacity onPress={() => {setCategoryDropdownVisibility(false); setDatePickerVisibility(true);}} style={{backgroundColor: '#EEEEEE', height: verticalScale(34), marginHorizontal: scale(25), borderRadius: verticalScale(10), borderWidth: scale(1), alignItems: 'center', justifyContent: 'center'}}>
                  <Image source={require('../assets/images/calendar.png')} style={{height: scale(20), width: scale(20), position: 'absolute', alignSelf: 'flex-start', marginLeft: scale(8)}}></Image>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(16), marginBottom: -verticalScale(4)}}>{displayDate(selectedDate)}</Text>
                </TouchableOpacity>
                {datePickerVisibility != true ? <></> : <DateTimePicker mode='date' display='spinner' onChange={(event, date) => pickDate(date!)} maximumDate={new Date()} value={new Date(moment(selectedDate, 'YYYY-MM-DD-HH:mm:ss').format('YYYY-MM-DD'))}/>}
              </View>
            </View>

            <View style={{flexDirection: 'row', marginTop: -verticalScale(20)}}>
             <View>
              <View style={{backgroundColor: '#A8A8A8', height: verticalScale(40), width: scale(105), borderRadius: scale(10), position: 'absolute', bottom: verticalScale(2.5)}}></View>
              <TouchableOpacity onPress={toggleEditPopUpVisibility} style={{backgroundColor: '#E4E4E4', height: verticalScale(40), width: scale(105), justifyContent: 'center', borderRadius: scale(10), left: scale(2.5), marginRight: scale(40)}}>
                <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(18), textAlign: 'center'}}>Cancel</Text>
              </TouchableOpacity>
             </View>
             <View>
              <View style={{backgroundColor: '#1E6834', height: verticalScale(40), width: scale(105), borderRadius: scale(10), position: 'absolute', bottom: verticalScale(2.5)}}></View>
              <TouchableOpacity style={{backgroundColor: '#3CC560', height: verticalScale(40), width: scale(105), justifyContent: 'center', borderRadius: scale(10), left: scale(2.5)}}>
                <Text style={{fontFamily: 'Poppins_Regular', color: '#E4E4E4', fontSize: verticalScale(18), textAlign: 'center'}}>Edit</Text>
              </TouchableOpacity>
             </View>
            </View>

            {/* hidden text input */}
            <TextInput ref={hiddenNameInput} onKeyPress={(key) => typed(key, 'Name')} autoCapitalize='none' style={{position: 'absolute', opacity: 0}} value={selectedName}></TextInput>
            <TextInput ref={hiddenExpenseInput} keyboardType='numeric' onKeyPress={(key) => typed(key, 'Expense')} style={{position: 'absolute', opacity: 0}} value={selectedExpense}></TextInput>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
}
