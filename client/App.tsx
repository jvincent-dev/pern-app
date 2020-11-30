import React from 'react'
import NavigationStack from './navigation/NavigationStack'
import { NavigationContainer } from '@react-navigation/native'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper' 

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#88aced'
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <NavigationStack />
      </PaperProvider>
    </NavigationContainer>
  )
}