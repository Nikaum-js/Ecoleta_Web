import { Routes, Route } from 'react-router-dom'
import { CreatePoint } from './pages/CreatePoint'
import { Home } from './pages/Home'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-point" element={<CreatePoint />} />
    </Routes>
  )
}
