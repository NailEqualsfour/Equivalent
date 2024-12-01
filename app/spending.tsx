import { StatusBar, Text, StyleSheet, Image, Platform, ImageBackground, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { scale } from 'react-native-size-matters';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useState } from 'react';
import UserSession from "./UserSession";
import DatabaseService from './DatabaseService'

export default function Spending() {
  var userId = UserSession().getUserId()
  var database = DatabaseService()

  var budget = 700
  var categoryData = database.getTransactionGroupbyCategory(userId!)
  categoryData.sort((a, b) => b.cost - a.cost)
  
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
  var nullWidth = validCount == 0 ? 1.75 : validCount <= 6 ? 2 : 1.75
  var degree = 90
  function accumulatedRotation(category: any) {
    var usedDegree = degree
    if (displayPercentage(category.cost) >= 1) {
      degree = degree + (((category.cost/spent)*(100 - nullWidth*validCount) + nullWidth) / 100 * 360)
    }
    return usedDegree
  }
  return (
    <View style={{backgroundColor: '#E4E4E4', flex: 1}}>
			<View>
				<Text style={{position: 'absolute', alignSelf: 'center', marginTop: scale(175)}}>
				  <Text style={{fontFamily: 'Poppins_Light', fontSize: scale(20)}}>Spent</Text>
				</Text>

				<Text style={{position: 'absolute', alignSelf: 'center', marginTop: scale(210)}}>
					<Text style={{fontFamily: 'Poppins_Medium', fontSize: scale(35)}}>S${displayDollar(spent)}</Text>
					<Text style={{fontFamily: 'Poppins_Medium', fontSize: scale(15)}}>{displayCent(spent)}</Text>
				</Text>

        <View style={{position: 'absolute', alignSelf: 'center', justifyContent: 'center', marginTop: scale(265), height: scale(25), width: scale(100), borderRadius: scale(8), backgroundColor: 'white'}}>
          <Text style={{textAlign: 'center', marginRight: scale(17), fontFamily: 'Poppins_Light', fontSize: scale(12)}}>This month</Text>
          <Image source={require('../assets/images/arrow_down.png')} style={{position: 'absolute', right: scale(5), height: scale(13), width: scale(17), resizeMode: 'stretch'}}></Image>
        </View>

				<View style={{position: 'absolute', alignSelf: 'center', marginTop: scale(130), height: scale(215), width: scale(215), transform: [{rotate: '90deg'}, {scaleX: -1}]}}>
					<AnimatedCircularProgress size={scale(215)} width={scale(20)} fill={(1 - spent / budget) * 100} tintColor="#3D5875" backgroundColor="#E4E4E4" />
				</View>
				<View style={{position: 'absolute', alignSelf: 'center', marginTop: scale(130), height: scale(215), width: scale(215), borderRadius: scale(105), borderColor: '#3D5875', borderWidth: scale(3)}}></View>

        {/* Not gonna lie, the color circle shets are still fucked up */}
        <View style={{position: 'absolute', alignSelf: 'center', marginTop: scale(105), height: scale(265), width: scale(265)}}>
          {categoryData.map((category, index) => {
            var rotate = accumulatedRotation(category)
            var fill = (category.cost/spent)*(100 - nullWidth*validCount)
            if (displayPercentage(category.cost) < 1) {
              fill = 0
            }
            return (
              <View key={index} style={{position: 'absolute', transform: [{rotate: rotate + 'deg'}, {scaleX: -1}, {scaleY: -1}]}}>
                <AnimatedCircularProgress size={scale(265)} width={scale(8)} fill={fill} tintColor={database.getCategoryColor(userId!, category.name)} lineCap={'round'}/>
              </View>
            )
          })}
        </View>
			</View>


      <ScrollView fadingEdgeLength={scale(40)} style={{marginTop: scale(400), paddingLeft: scale(40), paddingRight: scale(40), marginBottom: scale(55)}}>
        {categoryData.map((category, index) => {
          return (
            <View key={index}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontFamily: 'Poppins_Regular', fontSize: scale(17)}}>{category.name}</Text>
                <Text style={{fontFamily: 'Poppins_Regular', fontSize: scale(17)}}>{category.cost == 0 ? '- ' : '-S$'+displayDollar(category.cost)+displayCent(category.cost)}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: scale(1)}}>
                <View style={{height: scale(10), width: scale((displayPercentage(category.cost) / displayPercentage(categoryData[0].cost) * 230) <= 10 ? 10 : displayPercentage(category.cost) / displayPercentage(categoryData[0].cost) * 230), borderRadius: scale(5), backgroundColor: database.getCategoryColor(userId!, category.name), marginTop: scale(-10)}}></View>
                <Text style={{fontFamily: 'Poppins_Regular', fontSize: scale(15), opacity: 0.6, marginTop: scale(-8)}}>{displayPercentage(category.cost)}%</Text>
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  );
}
