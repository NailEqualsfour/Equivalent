import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Constants from 'expo-constants';

import TestComponent from '@/components/TestComponent';

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, doc, getDocs, query, where } from "firebase/firestore"; 


export default function HomeScreen() {
  const router = useRouter();

  const firebaseConfig = {
    apiKey: "AIzaSyCc0QS52_4frVNHMczlvPpd92aFk7NFzIA",
    authDomain: "equivalent-c525f.firebaseapp.com",
    projectId: "equivalent-c525f",
    storageBucket: "equivalent-c525f.appspot.com",
    messagingSenderId: "519696329551",
    appId: "1:519696329551:android:7e64512476ab29cc49f33a"
  };
  const app = initializeApp(firebaseConfig);

  async function getAccountById(deviceId: string) {
    const document = await getDocs(query(collection(getFirestore(app), 'accounts'), where('account_id', '==', deviceId)));

    if (!document.empty) {
          console.log(document.docs[0].data());
    } else {
      addDoc(collection(getFirestore(app), 'accounts'), { account_id: Constants.installationId});
      console.log('New Phone Detected. New Account Created.');
    }
  }
  getAccountById(Constants.installationId)

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titl}>Test of thy testtrs</Text>

      <TestComponent/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 0,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});