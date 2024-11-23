import axios from "axios"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { logout } from "../utils/Auth"

interface User {
    username: string
    password: string
    email: string
    address: string
    city: string
}

const UserInfo = () => {
    const { username } = useParams<{ username: string }>()
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [error, setError] = useState<string>("")
    const navigate = useNavigate()

    const handleDeleteUser = async (username: string) => {
        try {
            const response = await axios.delete(`http://localhost:3000/api/users/${username}`)
            if (response.data.success) {
                console.log('Utente eliminato con successo')
                navigate('/')
            }
        } catch (error) {
            console.error('Errore durante l\'eliminazione', error)
        }
    }

    if (error) {
        return <div className="error-message">{error}</div>
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const response = await fetch(`http://localhost:3000/api/users`, {
                    headers: {
                        'Authorization': token || '',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const userData = await response.json()
                setCurrentUser(userData)
                
            } catch (error) {
                if (error instanceof Response && error.status === 403) {
                    setError("Accesso non autorizzato")
                } else {
                    setError("Errore durante il fetch dei dati")
                }
            }
        }
        fetchUserData()

        // setting timeout logout 
        const timeoutID = setTimeout(() => logout(navigate), 300000) // timeout to 10 seconds
        return () => clearTimeout(timeoutID)
    }, [])

    // aggiunto metodo per logout
    const handleLogout = () => {
        logout(navigate)
    }

    return (
        <div className="user-info-container">
            <h1>Benvenuto {username}!</h1>
            <div className="user-details">
                {currentUser && (
                    <>
                        <p>Email: {currentUser.email || 'Non specificata'}</p>
                        <p>Indirizzo: {currentUser.address || 'Non specificata'}</p>
                        <p>Città: {currentUser.city || 'Non specificata'}</p>
                        <div className="button-group-user">
                            <button type="button" className="btn-exit" onClick={handleLogout}>Esci</button>
                            <button onClick={() => handleDeleteUser(currentUser.username)} className="delete-button">Elimina Account</button>
                        </div>
                    </>
                )}
            </div>
            <h4>Timeout for auto logout setting to 10 seconds</h4>
        </div>
    )
}

export default UserInfo