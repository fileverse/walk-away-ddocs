import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { HomePage } from './pages/home'
import { RetrievePage } from './pages/retrieve'
import { EditPage } from './pages/edit'

function App() {
  return (
    <>
      {window.location.hash !== '#/override' && <Navbar />}

      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:portalAddress/retrieve" element={<RetrievePage />} />
          <Route path="/override" element={<EditPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
