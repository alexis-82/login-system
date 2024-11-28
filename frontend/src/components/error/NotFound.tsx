import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div>
            <h1>🚫 404 - Pagina non trovata</h1>
            <p>La pagina che stai cercando non esiste.</p>
            <Link to="/login">Torna alla home</Link>
        </div>
    )
}

export default NotFound;