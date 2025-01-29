import './App.css';
import Home from "./screens/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Referrals from './screens/Referrals';
import BottomNavigation from './components/BottomNavigation';
import Daily from './screens/Daily';
import Earn from './screens/Earn';
import AirDrop from './screens/AirDrop';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/shares" element={<Referrals />} />
        <Route path="/aidrop" element={<AirDrop />} />
      </Routes>
      <BottomNavigation /> {/* PERKELTAS ČIA */}
    </Router>
  );
}

export default App;
