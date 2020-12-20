const express = require('express')
const router = express.Router()
const pool = require('../../postgresPool')
const createErrorObject = (action, msg) => ({ msg: `Note not ${action} due to error: ${msg}` })

router.use((req, res, next) => { // TODO: add auth from token to uid
  const auth = req.get('authorization')

  if (!auth)
    res.status(400).send('Authorization Failed.')

  next()
})

// create - creates a new note (user_id, description)
router.post('/', (req, res) => {
  const { user_id, description } = req.body
  const query = 'INSERT INTO todos (user_id, description) VALUES ($1, $2) RETURNING *'
  const queryParams = [user_id, description]

  pool.query(query, queryParams)
    .then(({ rows }) => res.json(rows[0]))
    .catch(err => res.status(400).json(createErrorObject('created', err.message)))
})

// read - gets notes based on user_id (user_id)
router.get('/', (req, res) => {
  const auth = req.get("authorization")
  const query = 'SELECT * FROM todos WHERE user_id = $1'
  const queryParams = [auth]

  pool.query(query, queryParams)
    .then(({ rows }) => res.json(rows))
    .catch(err => res.status(400).json(createErrorObject('retrieved', err.message)))
})

// update - updates a note (todo_id, description)
router.put('/', (req, res) => {
  const { description, todo_id } = req.body
  const query = 'UPDATE todos SET description = $1, last_edited = NOW() WHERE todo_id = $2 RETURNING *'
  const queryParams = [description, todo_id]

  pool.query(query, queryParams)
    .then(({ rows, rowCount }) => rowCount > 0 ? res.json(rows[0]) : res.status(400).send('Error: No note to edit.'))
    .catch(err => res.status(400).json(createErrorObject('updated', err.message)))
})

// delete - deletes a note (todo_id)
router.delete('/', (req, res) => {
  const { todo_id } = req.body
  const query = 'DELETE FROM todos WHERE todo_id = $1 RETURNING *'
  const queryParams = [todo_id]

  pool.query(query, queryParams)
    .then(({ rows, rowCount }) => rowCount > 0 ? res.json(rows[0]) : res.status(400).send('Error: No note to delete.'))
    .catch(err => res.status(400).json(createErrorObject('deleted', err.message)))
})

module.exports = router