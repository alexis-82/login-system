import { sign } from 'jsonwebtoken'
import { Request, Response } from 'express'
import UserModel from '../models/userModel'
import SECRET_KEY from '../config/database'


interface User {
    username: string;
    password: string;
    email?: string;
    address?: string;
    city?: string;
}

class AuthController {
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            
            if (!username || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Username e password sono richiesti'
                });
                return;
            }

            const user = await UserModel.findByCredentials(username, password);

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Credenziali non valide'
                });
                return;
            }

            const token = sign(
                { username: user.username },
                String(process.env.JWT_SECRET || SECRET_KEY),
                { expiresIn: '120s' } // imposta il tempo di scadenza del token a 2 minuti
            );

            res.status(200).json({
                success: true,
                message: 'Login effettuato con successo',
                username: user.username,
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Errore interno del server'
            });
        }
    }

    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password, email, address, city }: User = req.body
            
            const existingUser = await UserModel.findByUsername(username)
            if (existingUser) {
                res.status(400).json({ message: 'Username già esistente' })
                return
            }

            await UserModel.create({ username, password, email, address, city })
            res.status(200).json({ message: 'Utente registrato con successo' })
        } catch (error) {
            res.status(500).json({ message: 'Errore nella registrazione' })
        }
    }
}

export default AuthController