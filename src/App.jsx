import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { HomePage } from "./components/home-page";

function App() {
  return (
    <div className="bg-[#F8F9FA]">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  );
}

export default App;
