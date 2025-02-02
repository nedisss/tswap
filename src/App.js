import React, { useEffect, useState, useCallback } from "react";
import './App.css';  // teisingas pavadinimas
import { db } from "./firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from "firebase/firestore";
import { selectUser, setUser } from "./features/userSlice";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import CalculateNums from "./components/CalculateNums";
import CoinAnimation from "./components/CoinAnimation";
import { selectShowMessage, setShowMessage } from "./features/messageSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { selectCoinShow } from "./features/coinShowSlice";
import { setTopUsers } from "./features/topUsersSlice";
import Loading from "./screens/Loading";
import { Helmet } from "react-helmet"; 
import Home from "./screens/Home"; 
import AirDrop from "./screens/AirDrop";  
import Earn from "./screens/Earn";  
import Daily from "./screens/Daily";  
import Referrals from "./screens/Referrals";  
import BottomNavigation from "./components/BottomNavigation"; 
import { useDispatch, useSelector } from "react-redux";

// Importing the MiningButton component
import MiningButton from "./components/MiningButton";

function App() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const message = useSelector(selectShowMessage);
    const coinShow = useSelector(selectCoinShow);

    const [webAppData, setWebAppData] = useState({
        id: null,
        firstname: "",
        lastname: "",
        username: "",
        languageCode: "en",
    });

    const [WebApp, setWebApp] = useState(null);

    // Function to process links data
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

    // Fetch user from Firestore
    const getUser = useCallback(() => {
        const unsub = onSnapshot(doc(db, "users", webAppData.id), async (docsnap) => {
            if (docsnap.exists()) {
                dispatch(
                    setUser({
                        uid: webAppData.id,
                        userImage: docsnap.data().userImage,
                        firstname: docsnap.data().firstname,
                        lastname: docsnap.data().lastname,
                        username: docsnap.data().username,
                        languageCode: docsnap.data().languageCode,
                        referrals: docsnap.data().referrals,
                        referredBy: docsnap.data().referredBy,
                        isPremium: docsnap.data().isPremium,
                        balance: docsnap.data().balance,
                        mineRate: docsnap.data().mineRate,
                        isMining: docsnap.data().isMining,
                        miningStartedTime: docsnap.data().miningStartedTime
                            ? docsnap.data().miningStartedTime.toMillis()
                            : null,
                        daily: {
                            claimedTime: docsnap.data().daily.claimedTime
                                ? docsnap.data().daily.claimedTime.toMillis()
                                : null,
                            claimedDay: docsnap.data().daily.claimedDay,
                        },
                        links: processLinks(docsnap.data().links),
                    })
                );
            } else {
                await setDoc(doc(db, "users", webAppData.id), {
                    firstName: webAppData.firstname,
                    lastName: webAppData.lastname || null,
                    username: webAppData.username || null,
                    languageCode: webAppData.languageCode,
                    referrals: {},
                    referredBy: null,
                    balance: 0,
                    mineRate: 0.01,
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

        return () => {
            unsub();
        };
    }, [dispatch, webAppData]);

    useEffect(() => {
        if (webAppData.id) {
            getUser();
        }
    }, [dispatch, webAppData, getUser]);

    // Fetch top users from Firestore
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

    // Show message using toast
    useEffect(() => {
        if (message) {
            toast(message.message, {
                autoClose: 2500,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
            });
            dispatch(setShowMessage(null));
        }
    }, [message, dispatch]);

    // Initialize WebApp
    useEffect(() => {
        if (typeof window.Telegram !== "undefined" && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();

            if (tg?.initDataUnsafe?.user?.id) {
                const userId = tg.initDataUnsafe.user.id;
                const userIdString = userId.toString();

                setWebAppData({
                    id: userIdString,
                    firstname: tg?.initDataUnsafe?.user?.first_name,
                    lastname: tg?.initDataUnsafe?.user?.last_name,
                    username: tg?.initDataUnsafe?.user?.username,
                    languageCode: tg?.initDataUnsafe?.user?.language_code,
                });

                tg.expand();
                tg.setBackgroundColor("#0b0b0b");
                tg.setHeaderColor("#0b0b0b");
            } else {
                setWebAppData({
                    id: "82424881123",
                    firstname: "Firstname",
                    lastname: null,
                    username: "@username",
                    languageCode: "en",
                });
            }
        } else {
            console.error("Telegram WebApp API is not available in this environment.");
        }
    }, []);

    const location = useLocation();

    // Set page title dynamically based on route
    const pageTitles = {
        "/": "Home",
        "/airdrop": "AirDrop",
        "/earn": "Earn",
        "/daily": "Daily",
        "/referrals": "Referrals",
    };

    const getPageTitle = () => pageTitles[location.pathname] || "React App";

    return (
        <div className="flex flex-col h-screen">
            <Helmet>
                <title>{getPageTitle()}</title>
            </Helmet>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/airdrop" element={<AirDrop />} />
                <Route path="/earn" element={<Earn />} />
                <Route path="/daily" element={<Daily/>} />
                <Route path="/referrals" element={<Referrals />} />
            </Routes>
            <BottomNavigation webAppData={webAppData} />
            
            {/* Add the MiningButton component here */}
            <MiningButton />

            <ToastContainer /> {/* Keep ToastContainer here for notifications */}
        </div>
    );
}

export default App;