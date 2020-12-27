import React, { useEffect } from 'react'
import NavigationStack from './navigation/NavigationStack'
import { NavigationContainer } from '@react-navigation/native'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper' 
import * as Sentry from "sentry-expo"

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#88aced'
  }
}

export default function App() {

  useEffect(() => {
    Sentry.init({
      dsn: 'https://5e6d0e15369b4a0e9c319df196ee56fa@o392675.ingest.sentry.io/5571670',
      enableInExpoDevelopment: false,
      debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
    })
  }, [])

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <NavigationStack />
      </PaperProvider>
    </NavigationContainer>
  )
}