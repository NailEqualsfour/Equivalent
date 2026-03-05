import { StatusBar, Text, StyleSheet, Image, Platform, ImageBackground, View, SafeAreaView, TouchableOpacity, Modal, TextInput, ToastAndroid, ScrollView } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import React, { useRef, useState } from 'react';
import UserSession from "./UserSession";
import DatabaseService from './DatabaseService'

export default function Setup() {
  var userId = UserSession().getUserId()
  var database = DatabaseService()

  var [categoryData, setCategoryData] = useState(database.getUserById(userId!)?.categories)
    function refreshData() {
      console.log('Data refreshed??')
      setCategoryData(database.getUserById(userId!)?.categories)
    }
  
  var [budget, setBudget] = useState('300.00')

  var hiddenBudgetInput = useRef<TextInput>(null);
  function toggleKeyboard() {
    hiddenBudgetInput.current?.focus()
  }
  function typed(key: any, text: string, setFunction?: any) {
    key = key.nativeEvent.key
    console.log(key)
    if (text != 'budget') {
      if (key == 'Backspace'){
        setFunction(text.slice(0, -1))
      }
      else {
        setFunction(text + key)
      }
    }
    else {
      if (key == 'Backspace') {
        setBudget(budget.substring(0, budget.length - 1))
      }
      else if (key == '.' && budget.length == 0) {
        setBudget('0.')
      }
      else if (key == '.' && budget.includes('.')) {
        setBudget(budget)
      }
      else if (key == '0' && budget.length == 0) {
        setBudget(budget)
      }
      else if (key != '.' && !budget.includes('.') && budget.length >= 4) {
        setBudget(budget)
      }
      else if (budget.includes('.') && budget.substr(budget.indexOf('.'), 3).length == 3) {
        setBudget(budget)
      }
      else if (key == '.' || key == '0' || key == '1' || key == '2' || key == '3' || key == '4' || key == '5' || key == '6' || key == '7' || key == '8' || key == '9') {
        setBudget(budget + key)
      }
    }
    
  }

  return (
    <>
    <View style={{backgroundColor: '#E4E4E4', height: verticalScale(80)}}></View>

    <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: '#E4E4E4', flex: 1}}>
      <View style={{marginTop: verticalScale(5), flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: scale(285)}}>
        <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(20), verticalAlign: 'middle'}}>Monthly Budget : S$</Text>
        <TouchableOpacity onPress={() => toggleKeyboard()} style={{backgroundColor: '#EEEEEE', height: verticalScale(30), width: scale(85), borderRadius: verticalScale(10), borderWidth: scale(1), alignItems: 'center', justifyContent: 'center'}}>
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(16), marginBottom: -verticalScale(4)}}>{budget}</Text>
          <TextInput ref={hiddenBudgetInput} onBlur={() => setBudget(Number(budget).toFixed(2).toLocaleString())} keyboardType='numeric' onKeyPress={(key) => typed(key, 'budget')} style={{position: 'absolute', opacity: 0}} value={budget}></TextInput>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: verticalScale(55), flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: scale(285)}}>
        <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(20), verticalAlign: 'middle'}}>Expense Categories</Text>
        <TouchableOpacity style={{justifyContent: 'center'}}>
          <Image source={require('../assets/images/add.png')} style={{height: scale(15), width: scale(15)}}></Image>
        </TouchableOpacity>
      </View>

      {categoryData?.map((category, index) => {
        var [categoryName, setCategoryName] = useState(category.name)
        var hiddenCategoryInput = useRef<TextInput>(null);
        var categoryNameRef = category.name
        function duplicateNameCheck() {
          // function don't really work now, it just allows any name-editing for now. It will work after connecting to Supabase
          if (categoryData?.filter(category => category.name === categoryName).length! > 1) {
            ToastAndroid.show('A category with similar name already exist', ToastAndroid.SHORT)
            setCategoryName(categoryNameRef)
          }
        }

        var [selectColorPopUpVisibility, setSelectColorPopUpVisibility] = useState(false)
        function toggleSelectColorPopUpVisibility() {
          setSelectColorPopUpVisibility(!selectColorPopUpVisibility)
        }
        var [deletePopUpVisibility, setDeletePopUpVisibility] = useState(false)
        function toggleDeletePopUpVisibility() {
          setDeletePopUpVisibility(!deletePopUpVisibility)
        }
        return (
          <View key={index}>
            <View style={{marginTop: verticalScale(10), flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: scale(285)}}>
              <TouchableOpacity onPress={toggleSelectColorPopUpVisibility} style={{height: scale(30), width: scale(30), backgroundColor: category.color, borderRadius: scale(8), alignSelf: 'center'}}></TouchableOpacity>
              <TouchableOpacity onPress={() => hiddenCategoryInput.current?.focus()} style={{backgroundColor: '#EEEEEE', height: verticalScale(30), width: scale(220), borderRadius: verticalScale(10), borderWidth: scale(1), borderColor: 'rgba(0, 0, 0, 0.3)', alignItems: 'center', justifyContent: 'center'}}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: verticalScale(16), marginBottom: -verticalScale(4)}}>{categoryName}</Text>
                <TextInput ref={hiddenCategoryInput} onBlur={() => duplicateNameCheck()} onKeyPress={(key) => typed(key, categoryName, setCategoryName)} style={{position: 'absolute', opacity: 0}} value={categoryName}></TextInput>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleDeletePopUpVisibility} style={{justifyContent: 'center'}}>
                <Image source={require('../assets/images/cross.png')} style={{height: scale(15), width: scale(15)}}></Image>
              </TouchableOpacity>
            </View>

            <View>
              <Modal visible={selectColorPopUpVisibility} transparent={true} statusBarTranslucent>
                <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center'}}>
                  <View style={{backgroundColor: '#E4E4E4', height: verticalScale(310), marginHorizontal: scale(25), paddingTop: verticalScale(25), borderRadius: scale(25), alignSelf: 'stretch'}}>
                    <View style={{flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: scale(265), marginTop: -verticalScale(10)}}>
                      <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(18), verticalAlign: 'middle'}}>Select Category Color</Text>
                      <TouchableOpacity onPress={toggleSelectColorPopUpVisibility} style={{height: verticalScale(25), width: verticalScale(33), backgroundColor: 'black', borderRadius: verticalScale(15), alignSelf: 'center', justifyContent: 'center', marginTop: -verticalScale(5)}}>
                        <Image source={require('../assets/images/cross.png')} style={{height: scale(12), width: scale(12), tintColor: 'white', alignSelf: 'center'}}></Image>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: scale(15)}}>
                        <TouchableOpacity style={{height: scale(55), width: scale(55), borderRadius: scale(10), margin: scale(10), backgroundColor: '#97DC1F'}}></TouchableOpacity>
                        <TouchableOpacity style={{height: scale(55), width: scale(55), borderRadius: scale(10), margin: scale(10), backgroundColor: '#32D5A3'}}></TouchableOpacity>
                        <TouchableOpacity style={{height: scale(55), width: scale(55), borderRadius: scale(10), margin: scale(10), backgroundColor: '#3CC560'}}></TouchableOpacity>
                      </View>
                      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity style={{height: scale(55), width: scale(55), borderRadius: scale(10), margin: scale(10), backgroundColor: '#F97A42'}}></TouchableOpacity>
                        <TouchableOpacity style={{height: scale(55), width: scale(55), borderRadius: scale(10), margin: scale(10), backgroundColor: '#06D3E2'}}></TouchableOpacity>
                        <TouchableOpacity style={{height: scale(55), width: scale(55), borderRadius: scale(10), margin: scale(10), backgroundColor: '#6061D6'}}></TouchableOpacity>
                      </View>
                      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity style={{height: scale(55), width: scale(55), borderRadius: scale(10), margin: scale(10), backgroundColor: '#EC3EF9'}}></TouchableOpacity>
                        <TouchableOpacity style={{height: scale(55), width: scale(55), borderRadius: scale(10), margin: scale(10), backgroundColor: '#EC4EA4'}}></TouchableOpacity>
                        <TouchableOpacity style={{height: scale(55), width: scale(55), borderRadius: scale(10), margin: scale(10), backgroundColor: '#E3346E'}}></TouchableOpacity>
                      </View>
                    </View>
                  </View>
                    
                </View>
              </Modal>
            </View>

            <View>
              <Modal visible={deletePopUpVisibility} transparent={true} statusBarTranslucent>
                <TouchableOpacity activeOpacity={1} style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center'}}>
                  <View style={{backgroundColor: '#E4E4E4', height: verticalScale(185), marginHorizontal: scale(17), paddingTop: verticalScale(22), marginTop: -verticalScale(30), borderRadius: scale(25), alignSelf: 'stretch'}}>
                    <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(18), textAlign: 'center'}}>Are you sure you want{'\n'}to delete this Category?</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: verticalScale(7)}}>
                      <Image source={require('../assets/images/dot.png')} style={{tintColor: category.color, height: scale(17), width: scale(17), marginBottom: verticalScale(3)}}></Image>
                      <Text numberOfLines={1} ellipsizeMode={'tail'} style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: verticalScale(16), marginHorizontal: scale(30), marginLeft: scale(17)}}>{categoryName}</Text>
                    </View>
                    <Text style={{fontFamily: 'Poppins_Regular', color: 'black', fontSize: verticalScale(18), textAlign: 'center'}}>This action is irreversible.</Text>
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
          </View>
        )
        
      })}

      <View style={{marginTop: verticalScale(55), flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: scale(285)}}>
        <Text style={{fontFamily: 'Poppins_Light', color: 'black', fontSize: scale(20), verticalAlign: 'middle'}}>Recurring Expense</Text>
        <TouchableOpacity style={{justifyContent: 'center'}}>
          <Image source={require('../assets/images/add.png')} style={{height: scale(15), width: scale(15)}}></Image>
        </TouchableOpacity>
      </View>

      <Text>Other features will come in the future~</Text>
      <View style={{height: verticalScale(500)}}></View>
      <Text>Nothing Here But Here's A Happy Face :D</Text>



    </ScrollView>
    </>
  );
}
