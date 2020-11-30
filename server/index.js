const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000

// middleware
app.use(cors())

app.use(express.json())

app.use('/api/todo', require('./routes/api/todo'))

// routes
app.get('/', (_, res) => res.send('<h1>Hello World!</h1>'))

app.listen(PORT, () => console.log(`server started on port: ${PORT}`))
