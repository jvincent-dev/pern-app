import React from 'react'
import { Text } from 'react-native'

export interface TextProps {
  children: Object
  style?: Object
  centered?: boolean
  type?: string
}

const defaultFontSizes: any = {
  h1: 32,
  h2: 19,
  default: 17,
  subtext: 15
}

export default function MyAppText(props: TextProps) {
  const { children, style, centered = false, type = 'default' } = props

  return (
    <Text
      {...props}
      style={[
        { fontSize: defaultFontSizes[type], color: '#363237' },
        centered && { textAlign: 'center' },
        style
      ]}
    >
      {children}
    </Text>
  )
}