import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// FORM
interface LoginForm {
    username: string;
    password: string;
}

// LOGIN
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginForm>({
        username: '',
        password: ''
    });

    // ERRORS
    const [error, setError] = useState<string>('');

    // Controlla se l'utente ha già effettuato l'accesso durante il montaggio del componente
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            navigate(`/api/users/${username}`);
        }
    }, []); // L'array di dipendenze vuoto garantisce che venga eseguito solo una volta al momento del montaggio

    // ONCHANGE
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // SUBMIT
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // validazione dei campi
        if (!formData.username || !formData.password) {
            setError('Inserire Username e Password');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json()

            if (data.success) {
                // Salvataggio token in localStorage
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                        
                        // // Opzionale: salva la data di login
                        // localStorage.setItem('loginDate', new Date().toISOString());
                        
                        // // Opzionale: imposta la scadenza del token (24 ore)
                        // const expirationDate = new Date();
                        // expirationDate.setHours(expirationDate.getHours() + 24);
                        // localStorage.setItem('tokenExpiration', expirationDate.toISOString());
                        
                        // dopo il login, vado alla pagina dell'utente
                    
                    // dopo il login, vado alla pagina dell'utente
                    navigate(`/api/users/${data.username}`);
                } else {
                    setError('Token non ricevuto dal server');
                }
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError('Errore durante il login');
            console.error('Login error:', error);
        }
    };

    // REGISTRATION
    const handleRegistration = () => {
        try {
            navigate('/register');
        } catch (error) {
            console.error('Errore durante il reindirizzamento:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="button-group">
                    <button type="submit">Accedi</button>
                    <button
                        type="button"
                        onClick={handleRegistration}
                        className="register-button"
                    >
                        Registrati
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;