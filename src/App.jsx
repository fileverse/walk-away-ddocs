import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { HomePage } from "./pages/home";
import { RetrievePage } from "./pages/retrieve";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/retrieve" element={<RetrievePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
