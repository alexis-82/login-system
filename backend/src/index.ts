import express, { json, Request, Response } from 'express'
import cors from 'cors'
import { join } from 'path'
import { generateServerInfoHtml } from './utils/htmlGenerator'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

const app = express()

app.use(cors())
app.use(json())
app.use(express.static(join(__dirname, 'public')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.get('/', (_req: Request, res: Response) => {
    const { html } = generateServerInfoHtml()
    res.send(html)
})

export default app 