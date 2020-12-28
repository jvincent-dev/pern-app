require('dotenv').config()

const Sentry = require('@sentry/node')
const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000

// middleware
process.env.NODE_ENV === 'production' && Sentry.init({ dsn: 'https://161e18d8cb2f4988ac93ae1747910b92@o392675.ingest.sentry.io/5572111' })

app.use(Sentry.Handlers.requestHandler())

app.use(cors())

app.use(express.json())

app.use('/api/todo', require('./routes/api/todo'))

app.use(Sentry.Handlers.errorHandler())

// routes
app.get('/', (_, res) => res.redirect('https://github.com/jvincent-dev/pern-app/'))

app.listen(PORT, () => console.log(`server started on port: ${PORT}`))