import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/login/Login'
import NotFound from './components/error/NotFound'
import UserInfo from './components/home/UserInfo'
import Register from './components/registration/Register'
import ProtectedRoute from './components/utils/ProtectedRoute'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route pubbliche */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route protette */}
        <Route
          path="/api/users/:username"
          element={
            <ProtectedRoute>
              <UserInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/api/users"
          element={
            <ProtectedRoute>
              <UserInfo />
            </ProtectedRoute>
          }
        />

        {/* Route non trovata */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App