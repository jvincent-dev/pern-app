import React from 'react'
import { StyleSheet } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function TouchableRippleIcon({ name, color, onPress }: any) {
  return (
    <TouchableRipple rippleColor='#c4c4c4' style={styles.listIcon} onPress={onPress}>
      <MaterialCommunityIcons
        name={name}
        color={color}
        size={26}
      />
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  listIcon: {
    padding: 8
  },
})