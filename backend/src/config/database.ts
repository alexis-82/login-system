import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.JWT_SECRET
export const usersFilePath = path.join(__dirname, '..', 'data', 'users.json')

export default SECRET_KEY 