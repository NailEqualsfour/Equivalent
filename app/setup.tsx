import { StatusBar, Text, StyleSheet, Image, Platform, ImageBackground, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { scale } from 'react-native-size-matters';

export default function Setup() {
  useFonts({
    Poppins_Light: require('../assets/fonts/Poppins-Light.ttf'),
    Poppins_Medium: require('../assets/fonts/Poppins-Medium.ttf'),
    Segoe_Ui_Symbol: require('../assets/fonts/segoe-ui-symbol.ttf'),
  });

  return (
    <View style={{backgroundColor: '#E4E4E4', flex: 1}}>
      <Text>Setup Page</Text>
    </View>
  );
}
