import { StatusBar, Text, StyleSheet, Image, Platform, ImageBackground, View, SafeAreaView, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useState } from 'react';
import UserSession from "./UserSession";
import DatabaseService from './DatabaseService'

export default function Spending() {
  var userId = UserSession().getUserId()
  var database = DatabaseService()

  var [budget, setBudget] = useState(database.getBudgetByPeriod(userId!, 'This month'))
  function updateBudget(period: string) {
    setBudget(database.getBudgetByPeriod(userId!, period))
  }
  
  var [categoryData, setCategoryData] = useState(database.getTransactionGroupbyCategoryByPeriod(userId!, 'This month'))
  function updateCategoryData(period: string) {
    setCategoryData(database.getTransactionGroupbyCategoryByPeriod(userId!, period))
  }
  
  var [spent, setSpent] = useState(0)
  function displayPercentage(value: number) {
    var sum = 0
    for (var data of categoryData) {
      sum = sum + data.cost
    }
    if (spent != sum) {
      setSpent(sum)
    }
    if (sum == 0) {
      return 0
    }
    return Math.round(value / sum * 100)
  }
  function displayDollar(value: number) {
    return Math.floor(value).toLocaleString()
  }
  function displayCent(value: number) {
    return value.toFixed(2).toString().substr(value.toFixed(2).toString().indexOf('.'), 3)
  }

  // Credit to Biondi Lee for improving my Colorful Divider Circle snazz
  function countValid() {
    var count = 0
    for (var category of categoryData) {
      if (displayPercentage(category.cost) != 0) {
        count = count + 1
      }
    }
    return count
  }
  var validCount = countValid()
  var nullWidth = validCount <= 1 ? 0 : validCount <= 6 ? 2 : 1.75
  var degree = 90
  function accumulatedRotation(category: any) {
    var usedDegree = degree
    if (displayPercentage(category.cost) >= 1) {
      degree = degree + (((category.cost/spent)*(100 - nullWidth*validCount) + nullWidth) / 100 * 360)
    }
    return usedDegree
  }

  var [dropdownVisible , setVisibility] = useState(false)
  function toggleVisibility() {
    setVisibility(!dropdownVisible)
    
  }
  var [activePeriod, setPeriod] = useState('This month')
  function selectPeriod(period: string) {
    setPeriod(period)
    updateBudget(period)
    updateCategoryData(period)
    toggleVisibility()
  }
  var periodOptions = ['This month', 'Last month', 'This year', 'Last year', 'Lifetime']

  return (
    <View style={{backgroundColor: '#E4E4E4', flex: 1}}>
			<View>
				<Text style={{position: 'absolute', alignSelf: 'center', marginTop: verticalScale(170)}}>
				  <Text style={{fontFamily: 'Poppins_Light', fontSize: verticalScale(20)}}>Spent</Text>
				</Text>

				<Text style={{position: 'absolute', alignSelf: 'center', marginTop: verticalScale(205)}}>
					<Text style={{fontFamily: 'Poppins_Medium', fontSize: verticalScale(33)}}>S${displayDollar(spent)}</Text>
					<Text style={{fontFamily: 'Poppins_Medium', fontSize: verticalScale(15)}}>{displayCent(spent)}</Text>
				</Text>

        <TouchableOpacity onPress={toggleVisibility} style={{position: 'absolute', alignSelf: 'center', justifyContent: 'center', marginTop: verticalScale(255), height: scale(25), width: scale(100), borderRadius: scale(8), backgroundColor: 'white', zIndex: 1}}>
          <Text style={{textAlign: 'center', marginRight: scale(17), fontFamily: 'Poppins_Light', fontSize: scale(12)}}>{activePeriod}</Text>
          <Image source={require('../assets/images/arrow_down.png')} style={{position: 'absolute', right: scale(5), height: scale(13), width: scale(17), resizeMode: 'stretch'}}></Image>
        </TouchableOpacity>
        
        <View>
          <Modal visible={dropdownVisible} transparent={true} statusBarTranslucent>
            <TouchableOpacity onPress={toggleVisibility} activeOpacity={1} style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', alignItems: 'center', justifyContent: 'center'}}></TouchableOpacity>
            <View style={{position: 'absolute', alignSelf: 'center', justifyContent: 'center', marginTop: verticalScale(255), height: scale(25), width: scale(100), borderRadius: scale(8), backgroundColor: 'white', zIndex: 1}}>
              <Text style={{textAlign: 'center', marginRight: scale(17), fontFamily: 'Poppins_Light', fontSize: scale(12)}}>{activePeriod}</Text>
              <Image source={require('../assets/images/arrow_down.png')} style={{position: 'absolute', right: scale(5), height: scale(13), width: scale(17), resizeMode: 'stretch'}}></Image>
            </View>
            <View style={{position: 'absolute', alignSelf: 'center', justifyContent: 'center', marginTop: verticalScale(255), paddingTop: verticalScale(25), height: scale(30*(periodOptions.length - 1)), width: scale(100), borderRadius: scale(8), backgroundColor: 'white'}}>
              {periodOptions.map((period, index) => {
                if (period == activePeriod) {
                  return null
                }
                return (
                  <View key={index}>
                    <View style={{justifyContent: 'center', height: scale(1), width: scale(100), borderRadius: scale(1), backgroundColor: 'black', zIndex: 2}}></View>
                    <TouchableOpacity onPress={() => selectPeriod(period)} style={{margin: scale(2)}}>
                      <Text style={{textAlign: 'center', fontFamily: 'Poppins_Light', fontSize: scale(12)}}>{period}</Text>
                    </TouchableOpacity>
                  </View>
                )
              })}
              
            </View>
          </Modal>
        </View>
        

				<View style={{position: 'absolute', alignSelf: 'center', marginTop: verticalScale(125.5), height: verticalScale(207.5), width: verticalScale(207.5), transform: [{rotate: '90deg'}, {scaleX: -1}]}}>
					<AnimatedCircularProgress size={verticalScale(207.5)} width={verticalScale(19.5)} fill={(1 - spent / budget) * 100} tintColor="#3D5875" backgroundColor="#E4E4E4" />
				</View>
				<View style={{position: 'absolute', alignSelf: 'center', marginTop: verticalScale(125.5), height: verticalScale(207.5), width: verticalScale(207.5), borderRadius: verticalScale(105), borderColor: '#3D5875', borderWidth: verticalScale(3)}}></View>

        {/* Not gonna lie, the color circle shets are still fucked up */}
        <View style={{position: 'absolute', alignSelf: 'center', marginTop: verticalScale(102), height: verticalScale(255.5), width: verticalScale(255.5)}}>
          {categoryData.map((category, index) => {
            var rotate = accumulatedRotation(category)
            var fill = (category.cost/spent)*(100 - nullWidth*validCount)
            if (displayPercentage(category.cost) < 1) {
              fill = 0
            }
            return (
              <View key={index} style={{position: 'absolute', transform: [{rotate: rotate + 'deg'}, {scaleX: -1}, {scaleY: -1}]}}>
                <AnimatedCircularProgress size={verticalScale(255.5)} width={verticalScale(8)} fill={fill} tintColor={database.getCategoryColor(userId!, category.name)} lineCap={'round'}/>
              </View>
            )
          })}
        </View>
			</View>


      <ScrollView fadingEdgeLength={verticalScale(35)} style={{marginTop: verticalScale(385), paddingLeft: scale(40), paddingRight: scale(40), marginBottom: verticalScale(50)}}>
        {categoryData.map((category, index) => {
          return (
            <View key={index}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontFamily: 'Poppins_Regular', fontSize: verticalScale(16)}}>{category.name}</Text>
                <Text style={{fontFamily: 'Poppins_Regular', fontSize: verticalScale(16)}}>{category.cost == 0 ? '- ' : '-S$'+displayDollar(category.cost)+displayCent(category.cost)}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(1)}}>
                <View style={{height: verticalScale(10), width: scale((displayPercentage(category.cost) / displayPercentage(categoryData[0].cost) * 230) <= 10 ? 10 : displayPercentage(category.cost) / displayPercentage(categoryData[0].cost) * 230), borderRadius: verticalScale(5), backgroundColor: database.getCategoryColor(userId!, category.name), marginTop: verticalScale(-10)}}></View>
                <Text style={{fontFamily: 'Poppins_Regular', fontSize: verticalScale(15), opacity: 0.6, marginTop: verticalScale(-7.5)}}>{displayPercentage(category.cost)}%</Text>
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  );
}
