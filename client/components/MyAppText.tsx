import React from 'react'
import { Text } from 'react-native'

const defaultFontSizes: any = {
  h1: 32,
  h2: 19,
  default: 17,
  subtext: 15
}

export default function MyAppText({ ...props }) {
  const { children, style, centered = false, type = 'default' } = props

  return <Text {...props} style={[{ fontSize: defaultFontSizes[type] }, centered && { textAlign: 'center' }, style]}>{children}</Text>
}