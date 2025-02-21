import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { HomePage } from './pages/home'
import { RetrievePage } from './pages/retrieve'
import { EditPage } from './pages/edit'

function App() {
  return (
    <div className="h-[100vh]">
      <Navbar />
      <div className="h-[90vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:portalAddress/retrieve" element={<RetrievePage />} />
          <Route path="/:portalAddress/edit" element={<EditPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
