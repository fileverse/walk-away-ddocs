import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { HomePage } from './pages/home'
import { RetrievePage } from './pages/retrieve'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:portalAddress/retrieve" element={<RetrievePage />} />
        <Route path="/:portalAddress/edit" element={<RetrievePage />} />
      </Routes>
    </>
  )
}

export default App
