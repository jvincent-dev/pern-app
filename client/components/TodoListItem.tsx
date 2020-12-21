import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Checkbox } from 'react-native-paper'
import MyAppText from './MyAppText'
import TouchableRippleIcon from './TouchableRippleIcon'
import moment from 'moment'

const TodoListItem = (props: any) => {
  const { item, onEdit, onDelete, handleCompletion } = props
  const updatedTimestamp = !!item.last_edited && moment(item.last_edited).format('ddd MM/DD/YYYY')

  return (
    <View style={styles.listItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
        <Checkbox.Android
          status={item.is_completed ? 'checked' : 'unchecked'}
          onPress={handleCompletion}
          color='#f2f2f2'
          uncheckedColor='#f2f2f2'
        />

        <View style={{ flexShrink: 1 }}>
          <MyAppText style={styles.text}>{item.description}</MyAppText>

          {
            updatedTimestamp &&
            <MyAppText style={styles.subtext} type='subtext'>
              Edited: {updatedTimestamp}
            </MyAppText>
          }
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {
          !item.is_completed &&
          <TouchableRippleIcon
            name='pencil-outline'
            color='#8FD694'
            onPress={onEdit}
          />
        }

        <TouchableRippleIcon
          name='delete-outline'
          color='#B3001B'
          onPress={onDelete}
        />
      </View>
    </View>
  )
}

export default memo(TodoListItem)

const styles = StyleSheet.create({
  text: {
    color: '#f2f2f2'
  },
  subtext: {
    color: '#f2f2f288',
    fontStyle: 'italic'
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#363237',
    margin: 8,
    padding: 12,
    borderRadius: 8,
    justifyContent: 'space-between'
  }
})