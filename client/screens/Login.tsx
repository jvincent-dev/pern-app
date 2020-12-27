import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, View, Platform } from 'react-native';
import { TextInput, TouchableRipple } from 'react-native-paper'
import MyAppText from '../components/MyAppText'
import firebase from 'firebase'
import ErrorText from '../components/ErrorText'

export default function LogIn({ navigation }: any) {
  const [email, setEmail]: [string, Function] = useState('')
  const [password, setPassword]: [string, Function] = useState('')
  const [errorMessage, setErrorMessage]: [string, Function] = useState('')
  const [isPassLost, setIsPassLost]: [boolean, Function] = useState(false)
  const passwordInputRef = useRef<any>(null)

  const handleLogIn = () =>
    firebase.auth().signInWithEmailAndPassword(email, password).catch(err => {
      if (err.message)
        setErrorMessage('Please check and try the email or password again')

      console.log('Error:', err.message)
    })

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior='padding' style={styles.inputContainer}>
        <MyAppText type='h1' centered>
          Pern:{'\n'}
          <MyAppText type='h2'>A To Do App</MyAppText>
        </MyAppText>

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

        {!!errorMessage.length && <ErrorText errorMessage={errorMessage} />}

        <TouchableRipple rippleColor='#c4c4c4' onPress={handleLogIn} style={styles.button}>
          <MyAppText style={{ color: 'white' }}>Log In</MyAppText>
        </TouchableRipple>

        <View style={styles.footer}>
          <TouchableRipple rippleColor='#c4c4c4' onPress={() => navigation.navigate('signup')} style={{ padding: 4 }}>
            <MyAppText type='subtext'>Sign up</MyAppText>
          </TouchableRipple>

          <TouchableRipple rippleColor='#c4c4c4' onPress={() => setIsPassLost(!isPassLost)} style={{ padding: 4 }}>
            <MyAppText type='subtext'>
              {isPassLost ? 'Well too bad...' : 'Forgot password?'}
            </MyAppText>
          </TouchableRipple>
        </View>

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
    flex: 1,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8
  },
  error: {
    backgroundColor: '#B3001B',
    fontWeight: 'bold',
    color: 'white'
  }
});