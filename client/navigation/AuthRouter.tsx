import React, { useEffect } from 'react'
import firebase from 'firebase'

const firebaseConfig = { // TODO: add firebaseConfig
}

export default function AuthRouter({ navigation }: any) {
  useEffect(() => {
    if (!firebase.apps.length)
      firebase.initializeApp(firebaseConfig)

    firebase.auth().onAuthStateChanged(user => navigation.navigate(user ? 'TodoStack' : 'AuthStack'))
  }, [])

  return <></>
}