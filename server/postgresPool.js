const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  password: 'TODO: Add Password',
  database: 'pern_todo',
  host: 'localhost',
  port: 5432
})

module.exports = pool