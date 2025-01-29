import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import money from "../assets/money.png";
import friends from "../assets/friends.png";
import daily from "../assets/daily.png";
import blockchain from "../assets/blockchain.png";
import home from "../assets/home.png";

function BottomNavigation() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div style={styles.navbar}>
            <button
                style={location.pathname === "/" ? styles.active : styles.button}
                onClick={() => navigate("/")}
            >
                <img src={home} alt="Home" style={styles.icon} />
            </button>
            <button
                style={location.pathname === "/money" ? styles.active : styles.button}
                onClick={() => navigate("/money")}
            >
                <img src={money} alt="Money" style={styles.icon} />
            </button>
            <button
                style={location.pathname === "/friends" ? styles.active : styles.button}
                onClick={() => navigate("/friends")}
            >
                <img src={friends} alt="Friends" style={styles.icon} />
            </button>
            <button
                style={location.pathname === "/daily" ? styles.active : styles.button}
                onClick={() => navigate("/daily")}
            >
                <img src={daily} alt="Daily" style={styles.icon} />
            </button>
            <button
                style={location.pathname === "/blockchain" ? styles.active : styles.button}
                onClick={() => navigate("/blockchain")}
            >
                <img src={blockchain} alt="Blockchain" style={styles.icon} />
            </button>
        </div>
    );
}

const styles = {
    navbar: {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px",
        backgroundColor: "#333",
    },
    button: {
        color: "#fff",
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    active: {
        color: "yellow",
        fontWeight: "bold",
    },
    icon: {
        width: "30px",
        height: "30px",
    },
};

export default BottomNavigation;
