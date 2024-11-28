import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoginForm {
    username: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginForm>({
        username: '',
        password: ''
    });
    const [error, setError] = useState<string>('');

    // controlla solo se l'utente è già autenticato
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/', { replace: true });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            setError('Inserire Username e Password');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Errore durante il login');
                return;
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', formData.username);
                navigate('/', { replace: true });
            } else {
                setError('Token non ricevuto dal server');
            }
        } catch (error) {
            setError('Errore di connessione al server');
            console.error('Login error:', error);
        }
    };

    const handleRegistration = () => {
        navigate('/register');
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
                        placeholder="Inserisci username"
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
                        placeholder="Inserisci password"
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