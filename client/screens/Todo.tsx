import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, FlatList, Alert, RefreshControl } from 'react-native'
import { FAB } from 'react-native-paper'
import Constants from 'expo-constants'
import firebase from 'firebase'
import MyAppText from '../components/MyAppText'
import ScreenWrapper from '../components/ScreenWrapper'
import NewToDoItemModal, { TodoItem } from '../components/NewToDoItemModal'
import TodoListItem from '../components/TodoListItem'
import ListHeader from '../components/ListHeader'

const partitionAndSortTodos = (todoList: TodoItem[]) =>
  [
    ...todoList
      .reduce((uncompletedAndCompleted: [TodoItem[], TodoItem[]], todoItem: TodoItem) => {
        if (todoItem.is_completed)
          uncompletedAndCompleted[1].push(todoItem)
        else
          uncompletedAndCompleted[0].push(todoItem)

        return uncompletedAndCompleted
      }, [[], []])
      .reduce((sortedPartitionedList: TodoItem[], partitionedList: TodoItem[]) => {
        const sortedList: TodoItem[] = partitionedList.sort((a: TodoItem, b: TodoItem) => {
          if (a.description < b.description)
            return -1
          else if (a.description > b.description)
            return 1

          return 0
        })

        sortedPartitionedList.push(...sortedList)

        return sortedPartitionedList
      }, [])
  ]

const handleCompletedTask = (userId: string, todo_id: string) =>
  fetch(`${Constants.manifest.extra.todoAPI}/completed`, {
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

  useEffect(() => { updateTasks() }, [])

  const updateTasks = () => {
    const { currentUser } = firebase.auth()

    setIsLoading(true)

    if (currentUser)
      fetch(`${Constants.manifest.extra.todoAPI}`, {
        headers: {
          'Authorization': currentUser.uid
        }
      }).then(res => res.ok ? res.json() : null)
        .then(list => {
          if (list)
            if (list['msg']) {
              console.log(list.msg)
            } else
              setTodoList(partitionAndSortTodos(list))
          setIsLoading(false)
        })
  }

  const deleteTask = (todo_id: string) => {
    const { currentUser } = firebase.auth()

    if (currentUser)
      Alert.alert(
        'Confirm Deletion',
        'deleting a task cannot be reversed.',
        [
          {
            text: 'cancel',
            style: 'cancel',
            onPress: () => null
          },
          {
            text: 'delete',
            style: 'destructive',
            onPress: () => {
              setIsLoading(true)

              fetch(`${Constants.manifest.extra.todoAPI}`, {
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

                  setIsLoading(false)
                })
            }
          }
        ]
      )
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
                .then((completedTask: TodoItem) => {
                  if (completedTask) {
                    const updatedTodoList: TodoItem[] = todoList
                    const updatedIndex: number = updatedTodoList.findIndex((listItem: TodoItem) => listItem.todo_id === completedTask.todo_id)

                    updatedTodoList[updatedIndex] = completedTask

                    setTodoList(partitionAndSortTodos(updatedTodoList))
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

  const renderTaskItem = useCallback(({ item }: any) =>
    <TodoListItem
      item={item}
      handleCompletion={() => completeTask(item.todo_id)}
      onEdit={() => handleTodoEdit(item)}
      onDelete={() => deleteTask(item.todo_id)}
    />
    , [todoList])

  const taskKeyExtractor = useCallback((item: TodoItem) => item.todo_id, [todoList])

  return (
    <ScreenWrapper>
      <NewToDoItemModal
        isVisible={showNewTodoModal}
        taskBeingEdited={taskBeingEdited}
        onClose={(updatedItem?: TodoItem) => {
          if (updatedItem) {
            const updatedTodoList = todoList

            if (taskBeingEdited) {
              const indexOfEditedItem = updatedTodoList.findIndex((listItem: TodoItem) => listItem.todo_id === updatedItem.todo_id)

              if (indexOfEditedItem !== -1)
                updatedTodoList[indexOfEditedItem] = updatedItem
            } else
              updatedTodoList.push(updatedItem)

            setTodoList(partitionAndSortTodos(updatedTodoList))
          }

          if (taskBeingEdited)
            setTaskBeingEdited(undefined)

          setShowNewTodoModal(false)
        }}
      />

      <FlatList
        data={todoList}
        keyExtractor={taskKeyExtractor}
        contentContainerStyle={styles.listContainer}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => <ListHeader />}
        ListEmptyComponent={() => <MyAppText centered style={styles.emptyListComponent}>Please add some tasks using button on the lower right.</MyAppText>}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={updateTasks} />}
        renderItem={renderTaskItem}
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