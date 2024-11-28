import UserModel from '../models/userModel'
import { Request, Response } from 'express'

interface User {
    username: string;
    password: string;
    [key: string]: any;
}

class UserController {
    static async getUser(req: Request, res: Response, _next?: unknown): Promise<void> {
        try {
            const user = await UserModel.findByUsername(req.params.username)
            if (!user) {
                res.status(404).json({ message: 'Utente non trovato' })
                return
            }

            const { password, username, ...userWithoutPassword } = user as User
            res.json(userWithoutPassword)
        } catch (error) {
            res.status(500).json({ message: 'Errore nel recupero dei dati utente' })
        }
    }

    static async deleteUser(req: Request, res: Response, _next: unknown): Promise<void> {
        try {
            const success = await UserModel.delete(req.params.username)
            if (!success) {
                res.status(404).json({ 
                    success: false, 
                    message: 'Utente non trovato'
                })
                return
            }

            res.json({ 
                success: true, 
                message: 'Utente eliminato con successo'
            })
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error)
            res.status(500).json({
                success: false, 
                message: 'Errore durante l\'eliminazione dell\'utente'
            })
        }
    }
}

export default UserController