import React from "react";
import { Link } from "react-router-dom";
import homeIcon from "../assets/home.png";
import airDropIcon from "../assets/AirDrop.png";
import earnIcon from "../assets/money.png";
import dailyIcon from "../assets/daily.png";
import referralsIcon from "../assets/friends.png";
import blockchain from "../assets/blockchain.png";

// Common styles for each Link item
const navItemStyles = "flex flex-col items-center transition-all duration-300 transform group hover:scale-110 hover:bg-blue-500 p-2 rounded-lg w-16";

const BottomNavigation = () => {
    return (
        <div className="flex justify-between p-2 bg-gray-800 text-white fixed bottom-0 w-full gap-x-1">
            {/* Home button */}
            <Link to="/" className={navItemStyles}>
                <img src={homeIcon} alt="Home" className="w-8 h-8 mb-1 transition-all group-hover:scale-110" />
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-all">Home</span>
            </Link>

            {/* AirDrop button */}
            <Link to="/airdrop" className={navItemStyles}>
                <img src={airDropIcon} alt="AirDrop" className="w-8 h-8 mb-1 transition-all group-hover:scale-110" />
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-all">AirDrop</span>
            </Link>

            {/* Earn button */}
            <Link to="/earn" className={navItemStyles}>
                <img src={earnIcon} alt="Earn" className="w-8 h-8 mb-1 transition-all group-hover:scale-110" />
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-all">Earn</span>
            </Link>

            {/* Daily button */}
            <Link to="/daily" className={navItemStyles}>
                <img src={dailyIcon} alt="Daily" className="w-8 h-8 mb-1 transition-all group-hover:scale-110" />
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-all">Daily</span>
            </Link>

            {/* Referrals button */}
            <Link to="/referrals" className={navItemStyles}>
                <img src={referralsIcon} alt="Referrals" className="w-8 h-8 mb-1 transition-all group-hover:scale-110" />
                <span className="text-xs opacity-0 group-hover:opacity-100 transition-all">Referrals</span>
            </Link>
        </div>
    );
};

export default BottomNavigation;
