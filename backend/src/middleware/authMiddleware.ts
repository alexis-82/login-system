import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import SECRET_KEY from '../config/database'

interface DecodedToken {
    username: string
    [key: string]: any
}

interface AuthRequest extends Request {
    user?: DecodedToken
}

const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Response | void => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(403).json({ message: 'Nessun token fornito' })
    }

    const token = authHeader.replace('Bearer ', '')

    verify(token, String(SECRET_KEY), (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token non valido' })
        }
        req.user = decoded as DecodedToken
        next()
    })
}

export { verifyToken, AuthRequest } 