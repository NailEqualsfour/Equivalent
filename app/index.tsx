import { StatusBar, Text, StyleSheet, Image, ImageBackground, View, TouchableOpacity, Modal, PanResponder, Animated } from 'react-native';
import { scale } from 'react-native-size-matters';
import React, { useState, useRef, useEffect } from "react";

export default function Index() {
  
  var [budget, setBudget] = useState('155.75')
  function deduct(budget: string, expense: string) {
    setBudget((Number(budget) - Number(expense)).toFixed(2))
    setExpense('')
  }

  var [expense, setExpense] = useState('')
  function type(input: string) {
    if (input == 'backspace') {
      if (expense == '0.'){
        setExpense('')
      }
      else {
        setExpense(expense.substring(0, expense.length - 1))
      }   
    }

    else if (input == '.' && expense.length == 0) {
      setExpense('0.')
    }

    else if (input == '.' && expense.includes('.')) {
      setExpense(expense)
    }

    else if (input == '0' && expense.length == 0) {
      setExpense(expense)
    }

    else if (input != '.' && !expense.includes('.') && expense.length >= 4) {
      setExpense(expense)
    }

    else if (expense.includes('.') && expense.substr(expense.indexOf('.'), 3).length == 3) {
      setExpense(expense)
    }

    else {
      setExpense(expense + input)
    }
  }

  function displayDollar(input: string, negative?: boolean) {
    var sign = 'S$'
    if (input.length == 0) {
      return ''
    }
    if (negative) {
      sign = '-S$'
    }
    if (input[0] == '-') {
      sign = '-S$'
      input = input.substr(1, 8)
    }
    if (input.includes('.')) {
      return sign + Number(input.substring(0, input.indexOf('.'))).toLocaleString()
    }
    return sign + Number(input).toLocaleString()
  }
  
  function displayCent(input: string) {
    if (input.length == 0 || !input.includes('.')) {
      return ''
    }
    return input.substr(input.indexOf('.'), 3)
  }

  var [popUpVisible , setVisibility] = useState(false)
  function toggleVisibility() {
    setVisibility(!popUpVisible)
  }
  var categoryList = ['Shopping', 'Transport', 'Grocery', 'Skincare', 'Meal', 'Entertainment']
  var [activeCategory, setCategory] = useState('Shopping')
  function selectCategory(category: string) {
    setCategory(category)
    toggleVisibility()
  }
  function scrollCategory(direction: string) {
    if (direction == 'up') {
      setCategory(categoryList.at(categoryList.indexOf(activeCategory) - 1)!)
    }
    if (direction == 'down') {
      try {
        setCategory(categoryList.at(categoryList.indexOf(activeCategory) + 1)!.toString())
      }
      catch {
        setCategory(categoryList[0])
      }
    }
  }

  var [pulseFade, setPulseFade] = useState(1)
  var pulseList = [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0]
  var [firstPulse, setFirstPulse] = useState(pulseList[5])
  var [secondPulse, setSecondPulse] = useState(pulseList[7])
  var [thirdPulse, setThirdPulse] = useState(pulseList[0])
  function pulse() {
    if (expense != ''){
      setTimeout(() => {
        try {
          setFirstPulse(Number(pulseList.at(pulseList.indexOf(firstPulse) + 1)!.toString()))
        }
        catch {
          setFirstPulse(pulseList[0])
        }
        try {
          setSecondPulse(Number(pulseList.at(pulseList.indexOf(secondPulse) + 1)!.toString()))
        }
        catch {
          setSecondPulse(pulseList[0])
        }
        try {
          setThirdPulse(Number(pulseList.at(pulseList.indexOf(thirdPulse) + 1)!.toString()))
        }
        catch {
          setThirdPulse(pulseList[0])
        }
      }, 100)
    }
  }
  pulse()

  const budgetRef = useRef(budget);
  const expenseRef = useRef(expense);
  const categoryRef = useRef(activeCategory)

  useEffect(() => {
    budgetRef.current = budget;
  }, [budget]);

  useEffect(() => {
    expenseRef.current = expense;
  }, [expense]);

  useEffect(() => {
    categoryRef.current = activeCategory;
  }, [activeCategory]);

  const translateY = useRef(new Animated.Value(0)).current;
  const MAX_TRANSLATE_Y = scale(-65);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        // Allow PanResponder to start for vertical swipes
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Allow PanResponder to take control for vertical swipes
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderMove: (_, gestureState) => {
        // Update the Animated value as the finger moves
        if (gestureState.dy < 0) { // Ensure only swiping up affects the position
          const clampedY = Math.max(gestureState.dy, MAX_TRANSLATE_Y)
          translateY.setValue(clampedY);
          setPulseFade((scale(60) + scale(clampedY)) / scale(60))
        }
      },
      onPanResponderTerminate: () => {
        console.log('fucked')
        // If gesture is interrupted, ensure spring back
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: () => {
        // Check if the current value of translateY is at the clamp limit
        translateY.stopAnimation((currentValue) => {
          if (currentValue === MAX_TRANSLATE_Y) {
            deduct(budgetRef.current, expenseRef.current)
          }
          setPulseFade(1)
        });

        // Animate back to the original position
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <>
      <ImageBackground {...panResponder.panHandlers} source={require('../assets/images/VentiSitDark.jpg')} style={{flex: 1, paddingTop: StatusBar.currentHeight}}>
        <Text style={{position: 'absolute', alignSelf: 'center', marginTop: scale(175) + StatusBar.currentHeight!}}>
          <Text style={{fontFamily: 'Poppins_Medium', color: 'white', fontSize: scale(50)}}>{Number(budget) <= -10000 ? displayDollar('-9999.99') : displayDollar(budget)}</Text>
          <Text style={{fontFamily: 'Poppins_Medium', color: 'white', fontSize: scale(25)}}>{Number(budget) <= -10000 ? displayCent('-9999.99') : displayCent(budget)}</Text>
        </Text>
        <Text style={{position: 'absolute', alignSelf: 'center', marginTop: scale(238) + StatusBar.currentHeight!, fontFamily: 'Segoe_Ui_Symbol', color: 'white', fontSize: scale(25), lineHeight: scale(25)}}>Budget Left</Text>

        <View style={{position: 'absolute', alignSelf: 'center', marginTop: scale(305), opacity: pulseFade}}>
          <Image source={require('../assets/images/arrow_up.png')} style={{opacity: expense == '' ? 0 : firstPulse, tintColor: 'white', height: scale(20), width: scale(30), resizeMode: 'stretch', marginBottom: scale(-6)}}></Image>
          <Image source={require('../assets/images/arrow_up.png')} style={{opacity: expense == '' ? 0 : secondPulse, tintColor: 'white', height: scale(20), width: scale(30), resizeMode: 'stretch', marginBottom: scale(-6)}}></Image>
          <Image source={require('../assets/images/arrow_up.png')} style={{opacity: expense == '' ? 0 : thirdPulse, tintColor: 'white', height: scale(20), width: scale(30), resizeMode: 'stretch'}}></Image>
        </View>
        
        <Animated.Text style={{textAlign: 'center', marginTop: 'auto', marginBottom: scale(10), transform: [{translateY}]}}>
          <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(30)}}>{displayDollar(expense, true)}</Text>
          <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(18)}}>{displayCent(expense)}</Text>
        </Animated.Text>

        <View  {...panResponder.panHandlers}>
          <View style={{marginBottom: scale(50)}}>
            <View style={{marginLeft: scale(75), marginRight: scale(75), justifyContent: 'space-between', height:scale(270)}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => type('7')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25), paddingTop: scale(5), paddingLeft: scale(3)}}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => type('8')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25), paddingTop: scale(5), paddingLeft: scale(3)}}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => type('9')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25), paddingTop: scale(5), paddingLeft: scale(3)}}>9</Text>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => type('4')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25), paddingTop: scale(5), paddingLeft: scale(3)}}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => type('5')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25), paddingTop: scale(5), paddingLeft: scale(3)}}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => type('6')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25), paddingTop: scale(5), paddingLeft: scale(3)}}>6</Text>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => type('1')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25), paddingTop: scale(5), paddingLeft: scale(3)}}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => type('2')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25), paddingTop: scale(5), paddingLeft: scale(3)}}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => type('3')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25), paddingTop: scale(5), paddingLeft: scale(3)}}>3</Text>
                </TouchableOpacity>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => type('backspace')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={require('../assets/images/backspace.png')} style={{height: scale(24), width: scale(24)}}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => type('0')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25), paddingTop: scale(5), paddingLeft: scale(3)}}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => type('.')} style={{width: scale(55), height: scale(55), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(40)}}>.</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={toggleVisibility} activeOpacity={1} style={{flexDirection: 'row', position: 'absolute', right: scale(-60), marginTop: scale(120), marginBottom: 'auto', width: scale(200), height: scale(30), borderRadius: scale(30), backgroundColor: "rgba(0, 0, 0, 0.6)", transform: [{rotate: '-90deg'}], alignItems: 'center', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={() => scrollCategory('down')}>
              <Image source={require('../assets/images/arrow_left.png')} style={{height: scale(20), width: scale(20), tintColor: 'white', marginLeft: scale(5), marginRight: scale(5)}}></Image>
            </TouchableOpacity>
            <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(20), includeFontPadding: false}}>{activeCategory}</Text>
            <TouchableOpacity onPress={() => scrollCategory('up')}>
              <Image source={require('../assets/images/arrow_right.png')} style={{height: scale(20), width: scale(20), tintColor: 'white', marginLeft: scale(5), marginRight: scale(5)}}></Image>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View>
        <Modal visible={popUpVisible} transparent={true} statusBarTranslucent>
          <TouchableOpacity onPress={toggleVisibility} activeOpacity={1} style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center'}}>
            
            {categoryList.map((category, index) => {
              return (
                <View key={index} style={{alignItems: 'center', justifyContent: 'center'}}>
                  <TouchableOpacity onPress={() => selectCategory(category)} style={{width: scale(200)}}>
                    <Text style={{fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(activeCategory == category ? 18 : 23), padding: scale(4), textAlign: 'center'}}>{activeCategory == category ? '~~ ' : ''}{category}{activeCategory == category ? ' ~~' : ''}</Text>
                  </TouchableOpacity>
                  {index == categoryList.length - 1 ? <View></View> : <View style={{height: scale(2), width: scale(130), backgroundColor: 'white', borderRadius: scale(3)}}></View>}
                </View>
              )})}

          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
});
