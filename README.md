# Login System

## 📝 Descrizione del Progetto
Sistema di autenticazione moderno e sicuro costruito con un'architettura moderna a microservizi. Il progetto implementa un sistema di login completo con frontend reattivo e backend scalabile.

## 🛠 Tecnologie Utilizzate

### Frontend
- **React**: Framework JavaScript per l'interfaccia utente
- **Vite**: Build tool per un'esperienza di sviluppo moderna
- **Local Storage**: Gestione sicura dei token JWT
- **Porta**: 80 (mappata su 5173 internamente)

### Backend
- **Express.js**: Framework Node.js per il backend
- **JWT**: Sistema di autenticazione con JSON Web Token
- **Porta**: 3000

### Infrastruttura
- **Docker**: Containerizzazione dell'applicazione
- **Docker Compose**: Orchestrazione dei servizi
- **Network**: Rete dedicata per la comunicazione tra i servizi

## 🏗 Struttura del Progetto
```
login/
├── frontend/         # Applicazione React
├── backend/          # Server Express
└── docker-compose.yaml
```

## 🚀 Installazione e Avvio

### Prerequisiti
- Docker
- Docker Compose

### Passi per l'Installazione
1. Clona il repository
```bash
git clone <repository-url>
cd login
```

2. Avvia i container con Docker Compose
```bash
docker-compose up --build
```

3. Accedi all'applicazione
- Frontend: http://localhost:80
- Backend API: http://localhost:3000

## ✨ Best Practices Implementate

### Sicurezza
- Separazione completa tra frontend e backend

### DevOps
- Containerizzazione completa dell'applicazione
- Configuration as code con Docker Compose
- Port mapping configurabile

### Architettura
- Architettura a microservizi
- Separazione delle responsabilità (SoC)
- API RESTful

### Sviluppo
- Hot-reload per sviluppo frontend
- Environment variables per la configurazione
- Struttura modulare del codice

## 🔐 Sistema di Sicurezza

### Autenticazione JWT
- Implementazione di JSON Web Token (JWT) per l'autenticazione sicura
- Token memorizzato nel localStorage con encryption
- Validazione del token lato backend per ogni richiesta protetta

### Gestione delle Sessioni
- **Timeout Automatico**: Logout automatico dopo 5 minuti di inattività
- **Cleanup Token**: 
  - Rimozione automatica del token dal localStorage al logout
  - Pulizia del token in caso di errori di autenticazione
  - Rimozione al timeout della sessione
  - Cancellazione in caso di token invalido o scaduto

### Sicurezza Avanzata
- **CORS**: Configurazione sicura per le richieste cross-origin
- **Headers di Sicurezza**: Implementazione di headers HTTP sicuri
- **Validazione Input**: Sanitizzazione di tutti gli input utente

### Flusso di Autenticazione
1. Login utente con credenziali
2. Generazione JWT lato server
3. Memorizzazione sicura del token nel localStorage
4. Inclusione automatica del token nelle richieste API
5. Validazione del token per ogni richiesta protetta
6. Cleanup del token in caso di:
   - Logout manuale
   - Timeout sessione
   - Errori di autenticazione
   - Token invalido/scaduto

## 💻 Sviluppo

### Ambiente di Sviluppo
1. Avvia i servizi in modalità development:
```bash
docker-compose up --build
```

2. I cambiamenti nel codice verranno automaticamente ricaricati grazie al volume mapping di Docker.

### Testing
- Frontend: Esegui i test dalla directory frontend
- Backend: Esegui i test dalla directory backend

## 📦 Deployment
Il deployment può essere effettuato facilmente su qualsiasi piattaforma che supporta Docker:

1. Build delle immagini:
```bash
docker-compose build
```

2. Push delle immagini (se necessario):
```bash
docker-compose push
```

3. Deploy su server:
```bash
docker-compose -f docker-compose.yaml up -d
```

## 🏗 Build Frontend

### Build con Vite
Per buildare l'applicazione frontend per la produzione:

1. Naviga nella directory frontend:
```bash
cd frontend
```

2. Esegui il comando di build:
```bash
npm run build
```

Il comando genererà una directory `dist` contenente i file ottimizzati per la produzione:
- File JavaScript minificati
- Asset statici compressi
- CSS ottimizzato
- File HTML con riferimenti aggiornati

I file di build possono essere trovati nella directory `frontend/dist`.

3. Esegui il comando per la preview:
```bash
npx serve -s dist -l 5173
```
## 🤝 Contributing
Le pull request sono benvenute. Per modifiche importanti, apri prima un issue per discutere cosa vorresti cambiare.

## 📝 License
[MIT](https://choosealicense.com/licenses/mit/)

---
## :camera: Screenshot
[![login.png](https://i.postimg.cc/R0sMSP4B/login.png)](https://postimg.cc/zLhmpFyt)

[![register.png](https://i.postimg.cc/HnJ1kH30/register.png)](https://postimg.cc/PvkRSggN)
