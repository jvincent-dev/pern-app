import React from 'react'
import { Platform, SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import { StatusBar as ExpoStatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'

export default function ScreenWrapper(props: any) {
  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style='dark' />

      {props.children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    marginTop: Platform.OS === 'ios'
      ? Constants.statusBarHeight
      : StatusBar.currentHeight
  }
})