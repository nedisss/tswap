import React from "react";
import MiningButton from "../components/MiningButton"; 


function Home() {
    return <div className="flex flex-col h-screen relative">
        <div className="flex items-center justify-center mt-16">
            <MiningButton />
        </div>
    </div>;
}

export default Home;
