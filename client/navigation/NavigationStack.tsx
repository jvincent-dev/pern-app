import React from 'react'
import Login from '../screens/Login'
import SignUp from '../screens/SignUp'
import Todo from '../screens/Todo'
import AuthRouter from './AuthRouter'
import { createStackNavigator } from '@react-navigation/stack'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'

const StackNav = createStackNavigator()

function AuthStack() {
  return (
    <StackNav.Navigator screenOptions={{ headerShown: false }}>
      <StackNav.Screen name='login' component={Login} />
      <StackNav.Screen name='signup' component={SignUp} />
    </StackNav.Navigator>
  )
}

function TodoStack() {
  return (
    <StackNav.Navigator screenOptions={{ headerShown: false }}>
      <StackNav.Screen name='todo' component={Todo} />
    </StackNav.Navigator>
  )
}

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthRouter,
      AuthStack,
      TodoStack
    },
    {
      initialRouteName: 'AuthRouter'
    }
  )
)