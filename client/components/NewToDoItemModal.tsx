import React, { useState } from 'react'
import { TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import Constants from 'expo-constants'
import firebase from 'firebase'
import FadeInModal from './FadeInModal'
import MyAppText from './MyAppText'
import ErrorText from './ErrorText'

export interface TodoItem {
  description: string
  is_completed: boolean
  last_edited?: Object
  todo_id: string
  user_id: string
}

interface ItemModalProps {
  isVisible: boolean
  onClose: Function
  taskBeingEdited?: TodoItem
}

const addTask = (user_id: string, description: string) =>
  fetch(`${Constants.manifest.extra.todoAPI}`, {
    method: 'POST',
    headers: {
      'Authorization': user_id,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id,
      description: description.trim()
    })
  }).then(res => res.ok ? res.json() : null)

const editTask = (userId: string, description: string, todo_id: string) =>
  fetch(`${Constants.manifest.extra.todoAPI}`, {
    method: 'PUT',
    headers: {
      'Authorization': userId,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      todo_id,
      description: description.trim()
    })
  }).then(res => res.ok ? res.json() : null)

export default function NewToDoItem(props: ItemModalProps) {
  const { isVisible, onClose, taskBeingEdited } = props
  const [description, setDescription]: [string, Function] = useState('')
  const [errorMessage, setErrorMessage]: [string, Function] = useState('')
  const isEdit = !!taskBeingEdited

  const handleSubmit = () => {
    const { currentUser } = firebase.auth()

    if (currentUser) {
      const { uid } = currentUser

      if (!description)
        setErrorMessage(`please input a task`)
      else if (isEdit)
        editTask(uid, description, taskBeingEdited?.todo_id || '')
          .then(newTodoItem => {
            if (newTodoItem)
              if (newTodoItem.msg) {
                setErrorMessage(newTodoItem.msg)
              } else
                closeAndReset(newTodoItem)
          }).catch(e => setErrorMessage(e.message))
      else
        addTask(uid, description)
          .then(newTodoItem => {
            if (newTodoItem)
              if (newTodoItem.msg) {
                setErrorMessage(newTodoItem.msg)
              } else
                closeAndReset(newTodoItem)
          }).catch(e => setErrorMessage(e.message))
    }
  }

  const handleOnShow = () => setDescription(taskBeingEdited?.description || '')

  const closeAndReset = (todoItem?: TodoItem) => {
    setDescription('')
    setErrorMessage('')
    onClose(todoItem)
  }

  return (
    <FadeInModal title={isEdit ? 'Edit Task' : 'New Task'} onShow={handleOnShow} isVisible={isVisible} onClose={() => closeAndReset()}>
      <KeyboardAvoidingView enabled={Platform.OS === 'ios'} behavior='position'>
        <TextInput
          value={description}
          onChangeText={(input: string) => setDescription(input)}
          style={styles.input}
          returnKeyType='done'
          placeholder='feed the dog'
          selectTextOnFocus
          autoFocus
        />
      </KeyboardAvoidingView>

      {!!errorMessage.length && <ErrorText errorMessage={errorMessage} />}

      <TouchableRipple rippleColor='#c4c4c4' onPress={handleSubmit} style={styles.button}>
        <MyAppText style={{ color: 'white' }}>{`${isEdit ? 'Edit' : 'Add'} Task`}</MyAppText>
      </TouchableRipple>
    </FadeInModal>
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#363237',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#2d4262',
    alignItems: 'center'
  }
})