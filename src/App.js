import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { db } from "./firebase";
import {
    collection,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from "firebase/firestore";
import { selectUser, setUser } from "./features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectShowMessage, setShowMessage } from "./features/messageSlice";
import { selectCoinShow } from "./features/coinShowSlice";
import { setTopUsers } from "./features/topUsersSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./screens/Home";
import AirDrop from "./screens/AirDrop";
import Earn from "./screens/Earn";
import Daily from "./screens/Daily";
import Referrals from "./screens/Referrals";
import BottomNavigation from "./components/BottomNavigation";
import Loading from "./screens/Loading";
import CalculateNums from "./components/CalculateNums";
import CoinAnimation from "./components/CoinAnimation";
import MiningButton from "./components/MiningButton";  // Importing the new MiningButton component
import { selectCalculated } from './features/calculateSlice';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";

function App() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const message = useSelector(selectShowMessage);
    const coinShow = useSelector(selectCoinShow);

    const [webApp, setWebApp] = useState({
        id: null,
        firstName: "",
        lastName: "",
        username: "",
        languageCode: "en",
    });

    const processLinks = (links) => {
        if (!links) return {};
        return Object.entries(links).reduce((acc, [key, value]) => {
            acc[key] = {
                ...value,
                time: value.time ? value.time.toMillis() : null,
            };
            return acc;
        }, {});
    };

    const getUser = useCallback(() => {
        if (!webApp.id) return;

        const unsub = onSnapshot(doc(db, "users", webApp.id), async (docSnap) => {
            if (docSnap.exists()) {
                dispatch(setUser({
                    uid: webApp.id,
                    userImage: docSnap.data().userImage,
                    firstName: docSnap.data().firstName,
                    lastName: docSnap.data().lastName,
                    username: docSnap.data().username,
                    languageCode: docSnap.data().languageCode,
                    referrals: docSnap.data().referrals,
                    referredBy: docSnap.data().referredBy,
                    isPremium: docSnap.data().isPremium,
                    balance: docSnap.data().balance,
                    mineRate: docSnap.data().mineRate,
                    isMining: docSnap.data().isMining,
                    miningStartedTime: docSnap.data().miningStartedTime
                        ? docSnap.data().miningStartedTime.toMillis()
                        : null,
                    daily: {
                        claimedTime: docSnap.data().daily.claimedTime
                            ? docSnap.data().daily.claimedTime.toMillis()
                            : null,
                        claimedDay: docSnap.data().daily.claimedDay,
                    },
                    links: processLinks(docSnap.data().links),
                }));
            } else {
                await setDoc(doc(db, "users", webApp.id), {
                    firstName: webApp.firstName,
                    lastName: webApp.lastName || null,
                    username: webApp.username || null,
                    languageCode: webApp.languageCode,
                    referrals: {},
                    referredBy: null,
                    balance: 0,
                    mineRate: 0.001,
                    isMining: false,
                    miningStartedTime: null,
                    daily: {
                        claimedDay: null,
                        claimedTime: 0,
                    },
                    links: null,
                });
            }
        });

        return () => unsub();
    }, [dispatch, webApp]);

    useEffect(() => {
        if (webApp.id) {
            getUser();
        }
    }, [getUser]);

    useEffect(() => {
        if (typeof window.Telegram !== "undefined" && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();

            if (tg?.initDataUnsafe?.user?.id) {
                setWebApp({
                    id: tg.initDataUnsafe.user.id.toString(),
                    firstName: tg.initDataUnsafe.user.first_name,
                    lastName: tg.initDataUnsafe.user.last_name,
                    username: tg.initDataUnsafe.user.username,
                    languageCode: tg.initDataUnsafe.user.language_code,
                });

                tg.expand();
                tg.setBackgroundColor("#0b0b0b");
                tg.setHeaderColor("#0b0b0b");
            } else {
                setWebApp({
                    id: "82424881123",
                    firstName: "FirstName",
                    lastName: null,
                    username: "@username",
                    languageCode: "en",
                });
            }
        } else {
            console.error("Telegram WebApp API is not available in this environment.");
        }
    }, []);

    const location = useLocation();
    const pageTitles = {
        "/": "Home",
        "/airdrop": "AirDrop",
        "/earn": "Earn",
        "/daily": "Daily",
        "/referrals": "Referrals",
    };
    const getPageTitle = () => pageTitles[location.pathname] || "React App";

    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const userRef = collection(db, "users");
                const q = query(userRef, orderBy("balance", "desc"), limit(50));
                const querySnapshot = await getDocs(q);
                const topUsers = querySnapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    balance: docSnap.data().balance,
                    userImage: docSnap.data().userImage,
                    firstName: docSnap.data().firstName,
                    lastName: docSnap.data().lastName,
                }));
                dispatch(setTopUsers(topUsers));
            } catch (error) {
                console.error("Error fetching top users", error);
            }
        };

        fetchTopUsers();
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            toast(message.message, {
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                closeButton: false,
            });
            dispatch(setShowMessage(null));
        }
    }, [message, dispatch]);

    return (
        <>
            {user && <BottomNavigation />}

            {/* Balance and Upgrade Button */}
            {user && (
                <>
                    <div className="absolute top-5 left-5 text-white">
                        <span>Balance: ₿ {user.balance}</span>
                    </div>

                    {/* Upgrade button logic */}
                    <MiningButton />

                    <CalculateNums />
                    <ToastContainer
                        style={{
                            width: "calc(100% - 40px)",
                            maxWidth: "none",
                            left: "20px",
                            right: "20px",
                            top: "20px",
                            height: "20px",
                        }}
                        toastStyle={{
                            minHeight: "20px",
                            padding: "0px 10px",
                            paddingBottom: "4px",
                            backgroundColor:
                                message?.setHeaderColor === "green"
                                    ? "#00C000"
                                    : message?.setHeaderColor === "blue"
                                    ? "#1d4ed8"
                                    : "red",
                            color: "white",
                            borderRadius: "6px",
                            marginBottom: "4px",
                        }}
                    />
                    <CoinAnimation showAnimation={coinShow} />
                </>
            )}

            <Routes>
                <Route path="/mining" element={<MiningButton />} />
                <Route path="*" element={<Loading />} />
                <Route path="/" element={<Home />} />
                {user && <Route path="/daily" element={<Daily />} />}
                {user && <Route path="/earn" element={<Earn />} />}
                {user && <Route path="/referrals" element={<Referrals />} />}
                {user && <Route path="/airdrop" element={<AirDrop />} />}
            </Routes>
        </>
    );
}

export default App;
