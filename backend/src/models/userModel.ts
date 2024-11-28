import { promises as fs } from 'fs'
import { usersFilePath } from '../config/database'

class UserModel {
    static async findByCredentials(username: string, password: string) {
        try {
            const userData = await fs.readFile(usersFilePath, 'utf8')
            const parsedUserData = JSON.parse(userData)
            return parsedUserData.users.find((u: { username: string; password: string }) => 
                u.username === username && u.password === password
            )
        } catch (error) {
            console.error('Error reading users file:', error)
            throw new Error('Error accessing user data')
        }
    }

    static async findByUsername(username: any) {
        const userData = await fs.readFile(String(usersFilePath), 'utf8')
        const parsedUserData = JSON.parse(userData)
        return parsedUserData.users.find((u: { username: string }) => u.username === username)
    }

    static async create(userData: any) {
        const fileData = await fs.readFile(String(usersFilePath), 'utf8')
        const parsedData = JSON.parse(fileData)
        parsedData.users.push(userData)
        await fs.writeFile(String(usersFilePath), JSON.stringify(parsedData, null, 2))
        return userData
    }

    static async delete(username: any) {
        const fileData =await fs.readFile(String(usersFilePath), 'utf8')
        const parsedData = JSON.parse(fileData)
        const userIndex = parsedData.users.findIndex((user: { username: string }) => user.username === username)
        
        if (userIndex === -1) return false
        parsedData.users.splice(userIndex, 1)
        await fs.writeFile(String(usersFilePath), JSON.stringify(parsedData, null, 2))
        return true
    }
}

export default UserModel 