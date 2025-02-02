import React from "react";
import LoadingModul from "../components/LoadingModul";
import backgroundImage from "../assets/bg3.png";

function Loading() {
    // Styles
    const containerStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
    };

    const loadingWrapperStyle = {
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        bottom: "14%",
    };

    return (
        <div style={containerStyle} className="h-screen relative">
            <div style={loadingWrapperStyle}>
                <LoadingModul size={60} />
            </div>
        </div>
    );
}

export default Loading;
