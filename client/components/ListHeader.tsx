import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import MyAppText from '../components/MyAppText'
import firebase from 'firebase'

const { currentUser } = firebase.auth()

const ListHeader = () =>
  <View style={styles.header}>
    <View style={{ flexShrink: 1, marginRight: 16 }}>
      <MyAppText type='h1'>Hello, {currentUser?.displayName || ''}</MyAppText>
      <MyAppText type='h2' style={{ color: '#73605b' }} >here are your tasks...</MyAppText>
    </View>

    <MaterialCommunityIcons name='logout' size={24} color='#B3001B' onPress={() => firebase.auth().signOut()} />
  </View>

export default ListHeader

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: .5,
    backgroundColor: '#f2f2f2',
    zIndex: 1
  },
})  