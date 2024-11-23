const express = require('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'test' // usare .env

const app = express()
const port = 3000

// Middleware per gestire CORS e parsing JSON
app.use(cors())
app.use(express.json())

// Servizio di file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (_req, res) => {
  const serverInfo = {
    name: 'Login Server API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      root: '/',
      login: '/api/users [POST]',
      users: '/api/users [GET]',
      delete: '/api/users/:username [DELETE]',
      register: '/register [POST]'
    },
    timestamp: new Date().toISOString()
  }

  // Generazione dinamica del HTML con le informazioni del server
  const html = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${serverInfo.name}</title>
      <link rel="stylesheet" href="/styles/server.css">
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${serverInfo.name}</h1>
          <h3>Status:</h3>
          <span class="status">${serverInfo.status}</span>
        </div>

        <div class="endpoints">
          <h2>Endpoints disponibili:</h2>
          ${Object.entries(serverInfo.endpoints).map(([name, path]) => `
            <div class="endpoint">
              <strong>${name}</strong>: ${path}
            </div>
          `).join('')}
        </div>

        <div class="timestamp">
          Ultimo aggiornamento: ${new Date(serverInfo.timestamp).toLocaleString('it-IT')}
        </div>
      </div>
    </body>
    </html>
  `
  res.send(html)
})

const usersFilePath = path.join(__dirname, 'data', 'users.json')

// Route per il login
app.post('/api/users', async (req, res) => {
  try {
    // Estrazione credenziali dalla richiesta
    const { username, password } = req.body
    
    // Lettura asincrona del file JSON degli utenti
    const userData = await fs.readFile(usersFilePath, 'utf8')
    const parsedUserData = JSON.parse(userData)

    // Ricerca utente con credenziali corrispondenti
    const user = parsedUserData.users.find(u => u.username === username && u.password === password)

    // Risposta in base all'esito del login
    if (user) {
      const token = jwt.sign(
        { username: user.username }, 
        SECRET_KEY, 
        { expiresIn: '1h' }  // Token valido per 1 ora
      )
      res.status(200).json({
        success: true,
        message: 'Login effettuato con successo',
        username: user.username,
        token
      })
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenziali non valide'
      })
    }
  } catch (error) {
    // Gestione degli errori
    res.status(500).json({ message: 'Errore nel processo di login' })
  }
})

// Middleware per verificare il token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']

  if (!token) {
    return res.status(403).json({ message: 'Nessun token fornito' })
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token non valido' })
    }
    req.user = decoded
    next()
  })
}

// Route per la registrazione di un nuovo utente
app.post('/register', async (req, res) => {
  try {
    // Estrazione dati utente dalla richiesta
    const { username, password, email, address, city } = req.body
    
    // Lettura asincrona del file JSON
    const userData = await fs.readFile(usersFilePath, 'utf8')
    const parsedUserData = JSON.parse(userData)

    // Verifica esistenza username
    const existingUser = parsedUserData.users.find(u => u.username === username)

    if (existingUser) {
      return res.status(400).json({ message: 'Username già esistente' })
    }

    // Aggiunta nuovo utente
    parsedUserData.users.push({username, password, email, address, city})

    // Scrittura asincrona del file JSON aggiornato
    await fs.writeFile(usersFilePath, JSON.stringify(parsedUserData, null, 2))

    res.status(200).json({ message: 'Utente registrato con successo'})
  } catch (error) {
    // Gestione degli errori
    res.status(500).json({ message: 'Errore nella registrazione' })
  }
})

// Route per ottenere la lista degli utenti
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const usersData = await fs.readFile(usersFilePath, 'utf8')
    const parsedUsersData = JSON.parse(usersData)
    
    // Trova solo l'utente corrispondente al token
    const user = parsedUsersData.users.find(u => u.username === req.user.username)
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' })
    }

    // Rimuove la password e l'username prima di inviare i dati
    const { password,username, ...userWithoutPassword } = user
    
    res.json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei dati utente' })
  }
})

// Route per eliminare un utente
app.delete('/api/users/:username', async (req, res) => {
  try {
    // Lettura asincrona del file JSON
    const usersData = await fs.readFile(usersFilePath, 'utf8')
    const userData = JSON.parse(usersData)

    // Ricerca indice utente da eliminare
    const usernameToDelete = req.params.username
    const userIndex = userData.users.findIndex(user => user.username === usernameToDelete)

    // Verifica esistenza utente
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'Utente non trovato'})
    }

    // Rimozione utente
    userData.users.splice(userIndex, 1)

    // Scrittura asincrona del file JSON aggiornato
    await fs.writeFile(usersFilePath, JSON.stringify(userData, null, 2))

    res.json({ success: true, message: 'Utente eliminato con successo'})
  } catch (error) {
    // Gestione degli errori
    console.error('Errore durante l\'eliminazione:', error)
    res.status(500).json({success: false, message: 'Errore durante l\'eliminazione dell\'utente'})
  }
})

// Avvio del server
app.listen(port, () => {
  console.log(`Server in esecuzione sulla porta: ${port}`)
})