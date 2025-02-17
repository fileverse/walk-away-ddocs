import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navbar';
import { HomePage } from './pages/home';
import { RetrievePage } from './pages/retrieve';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/retrieve" element={<RetrievePage />} />
      </Routes>
    </Router>
  );
}

export default App;
