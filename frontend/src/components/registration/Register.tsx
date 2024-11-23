import axios from "axios"
import { useState } from "react"
import '../../App.css'
import { useNavigate } from "react-router-dom"

// FORM
interface RegisterData {
    email: string,
    username: string,
    password: string,
    address: string,
    city: string
}

// REGISTRATION
const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<RegisterData>({
        email: '',
        username: '',
        password: '',
        address: '',
        city: ''
    })
    const [message, setMessage] = useState<string>('')

    // ONCHANGE
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // SUBMIT
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // validazione dei campi
        if (!formData.email || !formData.username || !formData.password || !formData.address || !formData.city) {
            setMessage('Tutti i campi sono obbligatori');
            return;
        }

        // controllo email con @
        if (!formData.email.includes('@')) {
            setMessage('Inserire un indirizzo email valido');
            return;
        }

        // registrazione dell'utente
        try {
            await axios.post('http://localhost:3000/register', formData)
            setMessage('Registrazione completata con successo')
            setFormData({ email: '', username: '', password: '', address: '', city: '' })
        } catch (error) {
            setMessage('Username già esistente')
        }
    }

    // BACK TO LOGIN
    const handleBackToLogin = () => {
        navigate('/')
    }

    return (
        <div className="register-container">
            <div className="register-form-container">
                <h2 className="register-title">Registrati</h2>

                {message && (<div className="register-message">{message}</div>)}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="email">E-Mail*:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="form-field">
                        <label htmlFor="username">Username*:</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Password*:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
                    </div>

                    <div className="form-field">
                        <label htmlFor="username">Indirizzo*:</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
                    </div>

                    <div className="form-field">
                        <label htmlFor="username">Città*:</label>
                        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} />
                    </div>

                    <div className="info">
                        <h5>* Campi obbligatori</h5>
                    </div>

                    <button type="submit" className="register-submit-btn">Registrati</button>

                    <button type="button" className="back-to-login-btn" onClick={handleBackToLogin}>Torna al Login</button>

                </form>
            </div>
        </div>
    )
}

export default Register