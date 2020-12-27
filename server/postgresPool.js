const { Pool } = require('pg')

console.log(process.env.DB_PASS, process.env.DB_HOST)

const pool = new Pool({
  user: 'postgres',
  password: process.env.DB_PASS,
  database: 'pern_todo',
  host: process.env.DB_HOST,
  port: 5432
})

module.exports = pool