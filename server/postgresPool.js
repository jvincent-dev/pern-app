const { Pool } = require('pg')
const config = process.env.NODE_ENV === 'production'
 ? { connectionString: process.env.DATABASE_URL }
 : {
  user: 'postgres',
  password: process.env.DB_PASS,
  database: 'pern_todo',
  host: process.env.DB_HOST,
  port: 5432
}

const pool = new Pool(config)

module.exports = pool