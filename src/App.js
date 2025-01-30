import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; 
import { Helmet } from "react-helmet"; 
import Home from "./screens/Home"; 
import AirDrop from "./screens/AirDrop";  
import Earn from "./screens/Earn";  
import Daily from "./screens/Daily";  
import Referrals from "./screens/Referrals";  
import BottomNavigation from "./components/BottomNavigation"; 

function App() {
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case "/":
                return "Home";
            case "/airdrop":
                return "AirDrop";
            case "/earn":
                return "Earn";
            case "/daily":
                return "Daily";
            case "/referrals":
                return "Referrals";
            default:
                return "React App";
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Helmet>
                <title>{getPageTitle()}</title>
            </Helmet>

            <header className="bg-gray-800 p-4 text-white text-center">
                <h1>{getPageTitle()}</h1>
            </header>

            <Routes>
                <Route path="/" element={<Home />} /> 
                <Route path="/airdrop" element={<AirDrop />} /> 
                <Route path="/earn" element={<Earn />} /> 
                <Route path="/daily" element={<Daily />} /> 
                <Route path="/referrals" element={<Referrals />} /> 
            </Routes>

            <BottomNavigation />
        </div>
    );
}

export default App;
