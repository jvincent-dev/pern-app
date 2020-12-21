import React from 'react'
import { Text, StyleSheet } from 'react-native'

interface ErrorTextProps {
  errorMessage: string
}

export default function ErrorText({ errorMessage }: ErrorTextProps) {
  return <Text style={styles.error}>{errorMessage}</Text>
}

const styles = StyleSheet.create({
  error: {
    padding: 4,
    marginVertical: 8,
    backgroundColor: '#B3001B',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
    fontSize: 15
  }
})