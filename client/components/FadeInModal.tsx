import React from 'react'
import { View, Modal, StyleSheet } from 'react-native'
import MyAppText from './MyAppText'
import TouchableRippleIcon from './TouchableRippleIcon'

export default function FadeInModal({ ...props }: any) {
  const { isVisible, onClose, title = '', children } = props

  return (
    <Modal visible={isVisible} animationType='fade' transparent {...props}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={[styles.header, !title && { justifyContent: 'flex-end' }]}>
            {!!title && <MyAppText type='h2'>{title}</MyAppText>}

            <TouchableRippleIcon name='close' onPress={onClose} />
          </View>

          {children}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    paddingTop: 0,
    minWidth: 240
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16
  },
  close: {
    padding: 4
  }
})