import { StatusBar, Text, StyleSheet, Image, Platform, ImageBackground, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { scale } from 'react-native-size-matters';

export default function TabTwoScreen() {
  useFonts({
    Poppins_Light: require('../../assets/fonts/Poppins-Light.ttf'),
    Poppins_Medium: require('../../assets/fonts/Poppins-Medium.ttf'),
    Segoe_Ui_Symbol: require('../../assets/fonts/segoe-ui-symbol.ttf'),
  });

  function test(){
    alert('What?')
  }

  return (
    <ImageBackground source={require('../../assets/images/VentiSitDark.jpg')} style={{flex: 1, paddingTop: StatusBar.currentHeight}}>
      
      <View>
        <Text style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: 'Poppins_Light', color: 'white', fontSize: scale(25)}}>Equivalent</Text>
        <TouchableOpacity onPress={test} style={{position: 'absolute', right: scale(17), top: scale(6)}}>
          <Image source={require('../../assets/images/more.png')} style={{height: scale(24), width: scale(24)}}></Image>
        </TouchableOpacity>
      </View>

      <Text style={{textAlign: 'center', top: scale(170)}}>
        <Text style={{fontFamily: 'Poppins_Medium', color: 'white', fontSize: scale(50)}}>S$155</Text>
        <Text style={{fontFamily: 'Poppins_Medium', color: 'white', fontSize: scale(25)}}>.75</Text>
      </Text>
      <Text style={{textAlign: 'center', top: scale(130), fontFamily: 'Segoe_Ui_Symbol', color: 'white', fontSize: scale(25)}}>Budget Left</Text>
      
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
});
