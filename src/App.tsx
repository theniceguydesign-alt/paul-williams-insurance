import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Intake from '@/pages/Intake'
import Login from '@/pages/Login'
import Admin from '@/pages/Admin'
import { AuthGuard } from '@/components/AuthGuard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intake" element={<Intake />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <AuthGuard>
            <Admin />
          </AuthGuard>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
