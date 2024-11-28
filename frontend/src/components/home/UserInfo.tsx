import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { logout } from "../utils/Auth"

// costante BASE_API_URL
const BASE_API_URL = 'http://localhost:3000/api';

interface User {
    username: string
    password: string
    email: string
    address: string
    city: string
}

const UserInfo = () => {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token')
                const storedUsername = localStorage.getItem('username')
                
                if (!storedUsername) {
                    throw new Error('Username non trovato')
                }

                const response = await fetch(`${BASE_API_URL}/users/${storedUsername}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const userData = await response.json()
                setCurrentUser(userData)
            } catch (error) {
                setError("Errore durante il recupero dei dati utente")
                console.error('Error fetching user data:', error)
            }
        }

        fetchUserData()

        // Opzionale: logout dopo 10 secondi per inutilizzo
        // setting timeout logout 
        // const timeoutID = setTimeout(() => logout(navigate), 10000) // timeout to 10 seconds
        // return () => clearTimeout(timeoutID)

    }, [])

    const handleDeleteUser = async () => {
        try {
            const token = localStorage.getItem('token')
            const storedUsername = localStorage.getItem('username')

            if (!storedUsername) {
                setError('Username non trovato')
                return
            }

            const response = await axios.delete(`${BASE_API_URL}/users/${storedUsername}`, {
                headers: {
                    'Authorization': token || '',
                    'Content-Type': 'application/json'
                },
            })

            if (response.data.success) {
                localStorage.clear()
                console.log('Utente eliminato con successo!')
                navigate('/login', { replace: true })
            }
        } catch (error) {
            console.error('Errore durante l\'eliminazione:', error)
            setError('Errore durante l\'eliminazione dell\'utente')
        }

    }

    const handleLogout = () => {
        logout(navigate)
    }

    if (error) {
        return <div className="error-message">{error}</div>
    }

    return (
        <div className="user-info-container">
            <h1>Benvenuto {localStorage.getItem('username')}!</h1>
            <div className="user-details">
                {currentUser && (
                    <>
                        <p>Email: {currentUser.email || 'Non specificata'}</p>
                        <p>Indirizzo: {currentUser.address || 'Non specificata'}</p>
                        <p>Città: {currentUser.city || 'Non specificata'}</p>
                        <div className="button-group-user">
                            <button
                                type="button"
                                className="btn-exit"
                                onClick={handleLogout}
                            >
                                Esci
                            </button>
                            <button
                                type="button"
                                className="delete-button"
                                onClick={handleDeleteUser}
                            >
                                Elimina Account
                            </button>
                        </div>
                    </>
                )}
            </div>
            <h4>Timeout for auto logout setting to 10 seconds</h4>
        </div>
    )
}

export default UserInfo