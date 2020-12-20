import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { TextInput, TouchableRipple } from 'react-native-paper'
import MyAppText from '../components/MyAppText'
import firebase from 'firebase'

export default function LogIn({ navigation }: any) {
  const [name, setName]: [string, Function] = useState('')
  const [email, setEmail]: [string, Function] = useState('')
  const [password, setPassword]: [string, Function] = useState('')
  const [errorMessage, setErrorMessage]: [string, Function] = useState('')
  const passwordInputRef = useRef<any>(null)

  const createAccount = () => {
    const firebaseAuth = firebase.auth()

    firebaseAuth.createUserWithEmailAndPassword(email, password).then(user => {
      if (user && firebaseAuth.currentUser)
        firebaseAuth.currentUser.updateProfile({ displayName: name })
    }).catch(err => {
      if (err.message.includes('in use')) // let user know if email already used
        setErrorMessage('Email already exists')

      console.log('Error:', err.message)
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView enabled behavior='padding' style={styles.inputContainer}>
        <MyAppText type='h1' centered>Sign Up</MyAppText>

        <TextInput
          mode='outlined'
          style={styles.input}
          value={name}
          label='Name'
          placeholder='Joe Dohn'
          returnKeyType='next'
          onChangeText={(input: string) => setName(input)}
          blurOnSubmit={false}
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />

        <TextInput
          mode='outlined'
          style={styles.input}
          value={email}
          label='Email'
          placeholder='hello@example.com'
          returnKeyType='next'
          onChangeText={(input: string) => setEmail(input)}
          blurOnSubmit={false}
          onSubmitEditing={() => passwordInputRef.current.focus()}
        />

        <TextInput
          mode='outlined'
          style={styles.input}
          ref={passwordInputRef}
          value={password}
          label='Password'
          returnKeyType='done'
          onChangeText={(input: string) => setPassword(input)}
          secureTextEntry
        />

        {!!errorMessage.length && <MyAppText style={styles.error} centered type='subtext'>{errorMessage}</MyAppText>}

        <TouchableRipple onPress={createAccount} style={styles.button}>
          <MyAppText style={{ color: 'white' }}>Sign Up</MyAppText>
        </TouchableRipple>

        <TouchableRipple onPress={() => navigation.navigate('login')} style={styles.login}>
          <MyAppText type='subtext' centered>Log in</MyAppText>
        </TouchableRipple>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  inputContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  input: {
    marginVertical: 16,
    borderWidth: 0
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    backgroundColor: '#2d4262',
    alignItems: 'center'
  },
  error: {
    backgroundColor: '#B3001B',
    fontWeight: 'bold',
    color: 'white'
  },
  login: {
    alignSelf: 'center',
    padding: 4
  }
});
