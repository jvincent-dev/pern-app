import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import firebase from 'firebase'

export default function Todo() {
  const [user, setUser]: [any, Function] = useState({})

  useEffect(() => {
    const currentUser = firebase.auth().currentUser

    setUser(currentUser || {})
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text onPress={() => firebase.auth().signOut()}>{user.displayName}</Text>
    </View>
  )
}