import React, { useEffect, useState } from 'react'
import { StyleSheet, FlatList, Alert, RefreshControl } from 'react-native'
import { FAB } from 'react-native-paper'
import Constants from 'expo-constants'
import firebase from 'firebase'
import MyAppText from '../components/MyAppText'
import ScreenWrapper from '../components/ScreenWrapper'
import NewToDoItemModal, { TodoItem } from '../components/NewToDoItemModal'
import TodoListItem from '../components/TodoListItem'
import ListHeader from '../components/ListHeader'

const handleCompletedTask = (userId: string, todo_id: string) =>
  fetch(`${Constants.manifest.extra.testDomain}/completed`, {
    method: 'PUT',
    headers: {
      'Authorization': userId,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ todo_id })
  }).then(res => res.ok ? res.json() : null)

export default function Todo() {
  const [todoList, setTodoList]: [TodoItem[], Function] = useState([])
  const [showNewTodoModal, setShowNewTodoModal] = useState(false)
  const [taskBeingEdited, setTaskBeingEdited]: [TodoItem | undefined, Function] = useState()
  const [isLoading, setIsLoading]: [boolean, Function] = useState(false)

  useEffect(() => { updateTodoList() }, [])

  const updateTodoList = () => {
    const { currentUser } = firebase.auth()

    setIsLoading(true)

    if (currentUser)
      fetch(`${Constants.manifest.extra.testDomain}`, {
        headers: {
          'Authorization': currentUser.uid
        }
      }).then(res => res.ok ? res.json() : null)
        .then(list => {
          if (list)
            if (list['msg']) {
              console.log(list.msg)
            } else
              setTodoList(list)
          setIsLoading(false)
        })
  }

  const deleteTodoItem = ({ todo_id }: TodoItem) => {
    const { currentUser } = firebase.auth()

    if (currentUser)
      return fetch(`${Constants.manifest.extra.testDomain}`, {
        method: 'DELETE',
        headers: {
          'Authorization': currentUser.uid,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ todo_id })
      }).then(res => res.ok ? res.json() : null)
        .then(deletedTodo => {
          if (deletedTodo)
            if (deletedTodo.msg) {
              console.log(deletedTodo.msg)
            } else
              setTodoList([...todoList.filter(listItem => listItem.todo_id !== deletedTodo.todo_id)])
        })
  }

  const completeTask = (todo_id: string) => {
    const { currentUser } = firebase.auth()

    if (currentUser)
      Alert.alert(
        'Confirm Completion',
        'completing a task cannot be reversed.',
        [
          {
            text: 'cancel',
            style: 'cancel',
            onPress: () => null
          },
          {
            text: 'confirm',
            style: 'default',
            onPress: () => {
              setIsLoading(true)

              handleCompletedTask(currentUser.uid, todo_id)
                .then(completedTask => {
                  if (completedTask) {
                    const updatedIndex: number = todoList.findIndex(listItem => listItem.todo_id === completedTask.todo_id)
                    const updatedTodoList: TodoItem[] = todoList

                    updatedTodoList[updatedIndex] = completedTask

                    setTodoList([...updatedTodoList])
                  }

                  setIsLoading(false)
                })
            }
          }
        ]
      )
  }

  const handleTodoEdit = (todoItem: TodoItem) => {
    setTaskBeingEdited(todoItem)
    setShowNewTodoModal(true)
  }

  return (
    <ScreenWrapper>
      <NewToDoItemModal
        isVisible={showNewTodoModal}
        taskBeingEdited={taskBeingEdited}
        onClose={(updatedItem?: TodoItem) => {
          if (updatedItem) {
            const updatedTodoList = todoList

            if (taskBeingEdited) {
              const indexOfEditedItem = todoList.findIndex((listItem: TodoItem) => listItem.todo_id === updatedItem.todo_id)

              if (indexOfEditedItem !== -1)
                updatedTodoList[indexOfEditedItem] = updatedItem
            } else
              updatedTodoList.push(updatedItem)

            setTodoList(updatedTodoList)
          }

          if (taskBeingEdited)
            setTaskBeingEdited(undefined)

          setShowNewTodoModal(false)
        }}
      />

      <FlatList
        data={todoList}
        keyExtractor={(item: TodoItem) => item.todo_id}
        contentContainerStyle={styles.listContainer}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => <ListHeader />}
        ListEmptyComponent={() => <MyAppText centered style={styles.emptyListComponent}>Uh-oh... stinky</MyAppText>}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={updateTodoList} />}
        renderItem={({ item }: any) =>
          <TodoListItem
            item={item}
            handleCompletion={() => completeTask(item.todo_id)}
            onEdit={() => handleTodoEdit(item)}
            onDelete={() => deleteTodoItem(item)}
          />
        }
      />

      <FAB
        icon='plus'
        onPress={() => setShowNewTodoModal(true)}
        style={styles.floatActionButton}
      />
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16
  },
  emptyListComponent: {
    marginVertical: 16
  },
  floatActionButton: {
    backgroundColor: '#2d4262',
    position: 'absolute',
    right: 18,
    bottom: 18
  }
})