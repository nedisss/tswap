import React, { useState, useEffect } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectCalculated } from "../features/calculateSlice";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { setShowMessage } from "../features/messageSlice";
import { setCoinShow } from "../features/coinShowSlice";

// Define the calculateMinedValue function
const calculateMinedValue = (miningStartedTime, maxMineRate) => {
    const elapsedTime = Date.now() - miningStartedTime;
    const elapsedHours = elapsedTime / (1000 * 60 * 60); // convert to hours
    const minedValue = Math.min(maxMineRate * elapsedHours, maxMineRate);
    return minedValue.toFixed(2); // returns a value rounded to 2 decimal places
};

function MiningButton() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const calculate = useSelector(selectCalculated);

    const [userBalance, setUserBalance] = useState(user?.coins || 0);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [claimedDisabled, setClaimedDisabled] = useState(false);
    const [showMiningTable, setShowMiningTable] = useState(false);  // Show the mining table

    const MAX_MINE_RATE = 100.0;
    const MINING_DURATION = 6 * 60 * 60 * 1000;  // 6 hours in milliseconds

    // Effect to track mining time remaining
    useEffect(() => {
        console.log('useEffect triggered');
        if (user && user.miningStartedTime && user.miningStartedTime.toMillis) {
            const checkTimeLeft = () => {
                const now = Date.now();
                const miningEndTime = user.miningStartedTime.toMillis() + MINING_DURATION;
                const remainingTime = miningEndTime - now;
                setTimeRemaining(remainingTime > 0 ? remainingTime : 0);
                console.log(`Time remaining: ${remainingTime}`);
            };
            checkTimeLeft();
            const interval = setInterval(checkTimeLeft, 1000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const startFarming = async () => {
        if (!user) {
            console.error("User not available");
            dispatch(setShowMessage({ message: "User data not available", color: "red" }));
            return;
        }

        try {
            dispatch(setShowMessage({ message: "Mining is starting...", color: "purple" }));
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, {
                isMining: true,
                miningStartedTime: serverTimestamp(),
            });

            dispatch(setCoinShow(true));
            dispatch(setShowMessage({ message: "Mining started!", color: "green" }));
        } catch (error) {
            console.error("Error starting farming:", error);
            dispatch(setShowMessage({ message: "Error! Please try again!", color: "red" }));
        }
    };

    const claimRewards = async () => {
        if (!user) {
            console.error("User not available");
            dispatch(setShowMessage({ message: "User data not available", color: "red" }));
            return;
        }

        try {
            if (timeRemaining === null || timeRemaining > 0) {
                dispatch(setShowMessage({ message: `You need to wait ${Math.ceil(timeRemaining / 60000)} minutes!`, color: "red" }));
                return;
            }

            dispatch(setShowMessage({ message: "Claiming coins in progress...", color: "green" }));
            setClaimedDisabled(true);

            const minedCoins = calculateMinedValue(user.miningStartedTime.toMillis(), MAX_MINE_RATE);

            await updateDoc(doc(db, "users", user.id), {
                coins: user.coins + parseFloat(minedCoins),
                isMining: false,
            });

            setUserBalance(user.coins + parseFloat(minedCoins));
            dispatch(setShowMessage({ message: `You claimed ${minedCoins} coins!`, color: "gold" }));
            setClaimedDisabled(false);
        } catch (error) {
            console.error("Error claiming rewards:", error);
            dispatch(setShowMessage({ message: "Error! Please try again!", color: "red" }));
            setClaimedDisabled(false);
        }
    };

    const handleHomeClick = () => {
        setShowMiningTable(true);  // Show the mining table
        console.log("Home button clicked, showing mining table");
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat().format(number);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            {/* Button to show the mining table */}
            <button onClick={handleHomeClick} style={{ marginBottom: "20px" }}>
                Show Mining Table
            </button>

            {/* Mining Table Section - Only appears when clicking Home */}
            {showMiningTable && (
                <div style={{
                    padding: "20px",
                    backgroundColor: "#f1f1f1",  // Light gray background
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    maxWidth: "600px",  // Center the content
                    margin: "0 auto",
                }}>
                    {/* Balance Section */}
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Balance: {formatNumber(userBalance)} coins
                    </div>

                    {/* Mining Status Section */}
                    <div style={{
                        backgroundColor: "#e0e0e0", // Light gray background for mining status
                        padding: "10px",
                        marginTop: "10px",
                        borderRadius: "5px",
                    }}>
                        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                            Mining Status: {user.isMining ? "Active" : "Inactive"}
                        </div>
                        <div style={{ fontSize: "14px", color: "#555" }}>
                            Mined: {user.miningStartedTime ? calculateMinedValue(user.miningStartedTime.toMillis(), MAX_MINE_RATE) : 0} coins
                        </div>
                        
                        {/* Time remaining section */}
                        <div style={{ marginTop: "10px", backgroundColor: "#bbb", height: "5px", borderRadius: "3px" }}>
                            <div style={{
                                backgroundColor: "#4caf50",
                                width: `${(timeRemaining / MINING_DURATION) * 100}%`,
                                height: "100%",
                                borderRadius: "3px"
                            }}></div>
                        </div>
                        <div style={{ fontSize: "12px", marginTop: "5px", color: "#777" }}>
                            Time remaining: {timeRemaining > 0 ? Math.ceil(timeRemaining / 60000) + " minutes" : "Mining completed"}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginTop: "20px" }}>
                        <button onClick={startFarming} disabled={claimedDisabled}>
                            {user.isMining ? "Mining in progress..." : "Start Mining"}
                        </button>
                        <button onClick={claimRewards} disabled={claimedDisabled || timeRemaining > 0}>
                            Claim Rewards
                        </button>
                    </div>
                </div>
            )}

            {/* Extra info block with balance */}
            <div className="relative w-full mx-4">
                <div className="absolute -top-12 left-0 text-white text-lg bg-gray-800 p-2 rounded">
                    Balance: ₿ {formatNumber(userBalance)}
                </div>
            </div>

            {/* Additional Block with Mining Status and Rate */}
            <div className="bg-gray-800 p-4 rounded-lg w-full">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-white text-lg">
                        {(user.isMining && "Activated") || "Deactivated"}
                    </span>
                    <div className="text-white">
                        <span className="text-sm">{formatNumber(user.mineRate)} ₿/s</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MiningButton;
